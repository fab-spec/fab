import fs from 'fs-extra'

import {
  FabServerExports,
  FabSpecExports,
  FetchApi,
  getContentType,
  SandboxType,
  ServerArgs,
  ServerConstructor,
  ServerType,
} from '@fab/core'
import { _log, InvalidConfigError, FabServerError, JSON5Config } from '@fab/cli'
import { readFilesFromZip } from './utils'
import v8_sandbox from './sandboxes/v8-isolate'
import { Cache } from './cache'
import node_vm_sandbox from '@fab/sandbox-node-vm'
import url from 'url'
import http from 'http'
import express, {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express'
import concat from 'concat-stream'
import fetch, { Request as NodeFetchRequest } from 'cross-fetch'
import { pathToSHA512 } from 'file-to-sha512'
import Stream from 'stream'
import { watcher } from '@fab/cli'
import httpProxy from 'http-proxy'
// @ts-ignore
import nodeToWebStream from 'readable-stream-node-to-web'

function isRequest(fetch_res: Request | Response): fetch_res is Request {
  return (
    fetch_res instanceof NodeFetchRequest || fetch_res.constructor?.name === 'Request'
  )
}
const log = _log(`Server`)

async function streamResponse(fetch_res: Response, res: ExpressResponse) {
  res.status(fetch_res.status)
  // This is a NodeFetch response, which has this method, but
  // the @fab/core types are from dom.ts, which doesn't. This
  // was the easiest workaround for now.
  // @ts-ignore
  const response_headers = fetch_res.headers.raw()
  delete response_headers['content-encoding']
  Object.keys(response_headers).forEach((header) => {
    const values = response_headers[header]
    res.set(header, values.length === 1 ? values[0] : values)
  })

  const body = fetch_res.body
  if (body) {
    if (typeof body.getReader === 'function') {
      if (!response_headers['transfer-encoding']) res.set('transfer-encoding', 'chunked')

      const reader = body.getReader()
      let x
      while ((x = await reader.read())) {
        const { done, value } = x
        if (done) break
        if (value) {
          if (typeof value === 'string') {
            res.write(value)
          } else {
            res.write(Buffer.from(value))
          }
        }
      }
      res.end()
    } else if (body instanceof Stream) {
      if (!response_headers['transfer-encoding']) res.set('transfer-encoding', 'chunked')

      await new Promise((resolve, reject) => {
        body.on('data', (chunk) => res.write(chunk))
        body.on('error', reject)
        body.on('end', resolve)
      })
      res.end()
    } else {
      const blob = await fetch_res.arrayBuffer()
      res.send(Buffer.from(blob))
    }
  } else {
    res.end()
  }
}

function createEnhancedFetch(port: number): FetchApi {
  return async function enchanched_fetch(
    url: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    const request_url = typeof url === 'string' ? url : url.url
    console.log({ request_url })
    const fetch_url = request_url.startsWith('/')
      ? // Need a smarter way to re-enter the FAB, eventually...
        `http://localhost:${port}${request_url}`
      : url
    console.log({ fetch_url })
    const response = await fetch(fetch_url, init)
    return Object.create(response, {
      body: {
        value: Object.create(response.body, {
          getReader: {
            get() {
              const webStream = nodeToWebStream(response.body)
              return webStream.getReader.bind(webStream)
            },
          },
        }),
      },
    })
  }
}

class Server implements ServerType {
  filename: string
  private port: number
  private config: string
  private env: string | undefined
  private enchanched_fetch: FetchApi

  constructor(filename: string, args: ServerArgs) {
    this.filename = filename
    console.log('HELLO!')
    this.port = parseInt(args.port)
    //  TODO: cert stuff

    if (isNaN(this.port)) {
      throw new InvalidConfigError(`Invalid port, expected a number, got '${args.port}'`)
    }

    this.config = args.config
    this.env = args.env
    this.enchanched_fetch = createEnhancedFetch(this.port)
  }

  private async createRenderer(
    src: string,
    runtimeType: SandboxType
  ): Promise<FabSpecExports> {
    const renderer =
      (await runtimeType) === SandboxType.v8isolate
        ? await v8_sandbox(src)
        : await node_vm_sandbox(src, this.enchanched_fetch)

    const bundle_id = (await pathToSHA512(this.filename)).slice(0, 32)
    const cache = new Cache()
    // Support pre v0.2 FABs
    if (typeof renderer.initialize === 'function') {
      renderer.initialize({ bundle_id, cache })
    }

    return renderer
  }

  private async renderReq(
    renderer: FabSpecExports,
    req: ExpressRequest,
    settings_overrides: any
  ): Promise<Response> {
    console.log('RENDERING REQUEST!!')
    const method = req.method
    const headers: any = req.headers
    const url = `${req.protocol}://${req.headers.host}${req.url}`
    const fetch_req = new NodeFetchRequest(url, {
      method,
      headers,
      ...(method === 'POST' ? { body: req.body } : {}),
    })

    const production_settings = renderer.metadata?.production_settings
    let fetch_res
    try {
      fetch_res = await renderer.render(
        // @ts-ignore
        fetch_req as Request,
        Object.assign({}, production_settings, settings_overrides)
      )
    } catch (err) {
      const msg = `An error occurred calling the render method on the FAB: \nError: \n${err}`
      throw new Error(msg)
    }
    try {
      if (fetch_res && isRequest(fetch_res)) {
        fetch_res = await this.enchanched_fetch(fetch_res)
      }
    } catch (err) {
      const msg = `An error occurred proxying a request returned from the FAB: \nError:\n${err}\nRequest:\n${fetch_res}`
      throw new Error(msg)
    }

    if (!fetch_res) {
      const msg = `Nothing was returned from the FAB renderer.`
      throw new Error(msg)
    }
    return fetch_res
  }

  private setupExpress(
    renderer: FabSpecExports,
    settings_overrides: any,
    files: { [filename: string]: Buffer }
  ): Express {
    const app = express()

    app.use((req, res, next) => {
      try {
        next()
      } catch (err) {
        log(`ERROR serving: ${req.url}`)
        log(err)
        if (!res.headersSent) {
          res.writeHead(500, `Internal Error:\n${err}`)
        }
        res.end()
      }
    })

    app.use((req, _res, next) => {
      req.pipe(
        concat((data: any) => {
          req.body = data.toString()
          next()
        })
      )
    })

    app.use((req, _res, next) => {
      log(`🖤${req.url}🖤`)
      next()
    })

    app.get('/_assets/*', (req, res) => {
      const pathname = url.parse(req.url!).pathname!
      res.setHeader('Content-Type', getContentType(pathname))
      res.setHeader('Cache-Control', 'immutable')
      res.end(files[pathname])
    })

    app.all('*', async (req, res) => {
      const fetch_res = await this.renderReq(renderer, req, settings_overrides)
      streamResponse(fetch_res, res)
    })

    return app
  }

  private async bootServer(runtimeType: SandboxType, proxyWs: string | undefined) {
    let proxy: any
    let server: ReturnType<typeof http.createServer>

    log(`Reading 💛${this.filename}💛...`)
    const files = await readFilesFromZip(this.filename)
    const src_buffer = files['/server.js']
    if (!src_buffer) {
      throw new FabServerError('Malformed FAB. Missing /server.js')
    }
    const src = src_buffer.toString('utf8')

    log.tick(`Done. Booting VM...`)
    const settings_overrides = await this.getSettingsOverrides()
    const renderer = await this.createRenderer(src, runtimeType)

    log.tick(`Done. Booting FAB server...`)

    await new Promise((resolve, _reject) => {
      const app = this.setupExpress(renderer, settings_overrides, files)
      if (!server) {
        server = http.createServer((req, res) => app(req, res))

        if (proxyWs) {
          if (!proxy) {
            proxy = httpProxy.createProxyServer({
              target: `ws://localhost:${proxyWs}`,
              ws: true,
            })
          }
          //   ? https.createServer({ key: this.key, cert: this.cert }, app)

          server.on('upgrade', (req, socket, head) => {
            proxy.ws(req, socket, head)
          })
        }

        server.listen(this.port, resolve)
      } else {
        resolve()
      }
    })

    log.tick(`Done.`)
    log(`Listening on 💛http://localhost:${this.port}💛`)
  }

  async serve(
    runtimeType: SandboxType,
    watching: boolean = false,
    proxyWs: string | undefined
  ) {
    if (!(await fs.pathExists(this.filename))) {
      throw new FabServerError(`Could not find file '${this.filename}'`)
    }

    if (watching) {
      log.note(`Watching 💛${this.filename}💛 for changes...`)
      await watcher([this.filename], () => this.bootServer(runtimeType, proxyWs), {
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 50,
        },
      })
    } else {
      await this.bootServer(runtimeType, proxyWs)
    }
  }

  private async getSettingsOverrides() {
    if (!this.env) return {}

    const config = await JSON5Config.readFrom(this.config)
    const overrides = config.data.settings?.[this.env]
    if (!overrides) {
      throw new InvalidConfigError(
        `No environment '${this.env}' found in ${this.config}!`
      )
    }
    return overrides
  }
}

const createServer: ServerConstructor = (filename: string, args: ServerArgs) =>
  new Server(filename, args)

const serverExports: FabServerExports = { createServer }
export default serverExports
