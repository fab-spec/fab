import fs from 'fs-extra'

import {
  FetchApi,
  getContentType,
  SandboxType,
  ServerArgs,
  ServerType,
  FabServerExports,
  ServerConstructor,
} from '@fab/core'
import { InvalidConfigError, JSON5Config } from '@fab/cli'
import { readFilesFromZip } from './utils'
import v8_sandbox from './sandboxes/v8-isolate'
import node_vm_sandbox from '@fab/sandbox-node-vm'
import url from 'url'
import http from 'http'
import express from 'express'
import concat from 'concat-stream'
import fetch, { Request as NodeFetchRequest } from 'cross-fetch'

function isRequest(fetch_res: Request | Response): fetch_res is Request {
  return (
    fetch_res instanceof NodeFetchRequest || fetch_res.constructor?.name === 'Request'
  )
}

class Server implements ServerType {
  filename: string
  private port: number
  private config: string
  private env: string | undefined

  constructor(filename: string, args: ServerArgs) {
    this.filename = filename
    this.port = parseInt(args.port)
    //  TODO: cert stuff

    if (isNaN(this.port)) {
      throw new InvalidConfigError(`Invalid port, expected a number, got '${args.port}'`)
    }

    this.config = args.config
    this.env = args.env
  }

  async serve(runtimeType: SandboxType) {
    if (!(await fs.pathExists(this.filename))) {
      throw new InvalidConfigError(`Could not find file '${this.filename}'`)
    }

    const settings_overrides = await this.getSettingsOverrides()

    const files = await readFilesFromZip(this.filename)
    console.log(files)

    const src_buffer = files['/server.js']
    if (!src_buffer) {
      throw new InvalidConfigError('Malformed FAB. Missing /server.js')
    }
    const src = src_buffer.toString('utf8')

    const enhanced_fetch: FetchApi = async (url, init?) => {
      const request_url = typeof url === 'string' ? url : url.url
      console.log({ request_url })
      if (request_url.startsWith('/')) {
        if (!request_url.startsWith('/_assets/')) {
          throw new Error('Fetching relative URLs for non-assets is not permitted.')
        }
        // Need a smarter wau to fetch assets, of course, but for now...
        return fetch(`http://localhost:${this.port}${request_url}`, init)
      }

      return fetch(url, init)
    }

    const renderer =
      (await runtimeType) === SandboxType.v8isolate
        ? await v8_sandbox(src)
        : await node_vm_sandbox(src, enhanced_fetch)

    await new Promise((resolve, reject) => {
      const app = express()

      app.use((req, res, next) => {
        req.pipe(
          concat((data: any) => {
            req.body = data.toString()
            next()
          })
        )
      })

      app.all('*', async (req, res) => {
        try {
          console.log({ url: req.url })
          const pathname = url.parse(req.url!).pathname!
          if (pathname.startsWith('/_assets')) {
            res.setHeader('Content-Type', getContentType(pathname))
            res.setHeader('Cache-Control', 'immutable')
            res.end(files[pathname])
          } else {
            const method = req.method
            const headers: any = req.headers
            const url = `${req.protocol}://${req.headers.host}${req.url}`
            const fetch_req = new NodeFetchRequest(url, {
              method,
              headers,
              ...(method === 'POST' ? { body: req.body } : {}),
            })

            const production_settings = renderer.metadata?.production_settings
            // console.log({production_settings})
            let fetch_res = await renderer.render(
              // @ts-ignore
              fetch_req as Request,
              Object.assign(
                {
                  __fab_server: '@fab/server',
                },
                production_settings,
                settings_overrides
              )
            )
            if (isRequest(fetch_res)) {
              console.log('GOT ME A NODE BOI REQUEST')
              console.log(fetch_res)
              console.log(fetch_res.url)
              fetch_res = await enhanced_fetch(fetch_res)
            }
            console.log({ status: fetch_res.status })
            res.status(fetch_res.status)
            // This is a NodeFetch response, which has this method, but
            // the @fab/core types are from dom.ts, which doesn't. This
            // was the easiest workaround for now.
            // @ts-ignore
            const response_headers = fetch_res.headers.raw()
            // console.log({response_headers})
            delete response_headers['content-encoding']
            Object.keys(response_headers).forEach((header) => {
              const values = response_headers[header]
              res.set(header, values.length === 1 ? values[0] : values)
            })
            const blob = await fetch_res.arrayBuffer()
            // console.log({response: Buffer.from(blob).toString()})
            res.send(Buffer.from(blob))
          }
        } catch (e) {
          console.log('ERROR')
          console.log(e)
          res.writeHead(500, 'Internal Error')
          res.end()
        }
      })
      const server = http.createServer(app)
      //   ? https.createServer({ key: this.key, cert: this.cert }, app)
      server.listen(this.port, resolve)
    })

    console.log(`Listening on http://localhost:${this.port}`)
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
