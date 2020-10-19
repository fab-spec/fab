import fs from 'fs-extra'

import {
  FabServerExports,
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
import express, { Express } from 'express'
import concat from 'concat-stream'
import fetch, { Request as NodeFetchRequest } from 'cross-fetch'
import { pathToSHA512 } from 'file-to-sha512'
import Stream from 'stream'
import { watcher } from '@fab/cli'
import httpProxy from 'http-proxy'
import { ReadableStream as WebReadableStream } from 'web-streams-polyfill/ponyfill/es2018'

const log = _log(`Server`)

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

  async serve(
    runtimeType: SandboxType,
    watching: boolean = false,
    proxyWs: string | undefined
  ) {
    if (!(await fs.pathExists(this.filename))) {
      throw new FabServerError(`Could not find file '${this.filename}'`)
    }

    let app: Express
    let proxy: any
    let server: ReturnType<typeof http.createServer>

    const bootServer = async () => {
      log(`Reading 💛${this.filename}💛...`)
      const files = await readFilesFromZip(this.filename)
      log.tick(`Done. Booting FAB server...`)

      const settings_overrides = await this.getSettingsOverrides()

      const src_buffer = files['/server.js']
      if (!src_buffer) {
        throw new FabServerError('Malformed FAB. Missing /server.js')
      }
      const src = src_buffer.toString('utf8')

      const { renderer } =
        (await runtimeType) === SandboxType.v8isolate
          ? await v8_sandbox(src)
          : await node_vm_sandbox(src, enhanced_fetch)

      const bundle_id = (await pathToSHA512(this.filename)).slice(0, 32)
      const cache = new Cache()
      // Support pre v0.2 FABs
      if (typeof renderer.initialize === 'function')
        renderer.initialize({ bundle_id, cache })

      log.tick(`Done. Booting VM...`)

      await new Promise((resolve, reject) => {
        app = express()

        app.use((req, res, next) => {
          // Convert the Reqest (extends <Stream.Readable>) into a
          // WHATWG Web Standard ReadableStream
          req.body = new WebReadableStream({
            start: (controller) => {
              req.on('data', controller.enqueue)
              req.on('close', controller.close)
              req.on('error', controller.error)
            },
          })
          next()
        })

        app.all('*', async (req, res) => {
          try {
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
              let fetch_res
              try {
                fetch_res = await renderer.render(
                  // @ts-ignore
                  fetch_req as Request,
                  Object.assign({}, production_settings, settings_overrides)
                )
              } catch (err) {
                const msg = `An error occurded calling the render method on the FAB: \nError: \n${err}`
                console.error(msg)
                return res.status(500).send(msg)
              }
              try {
                if (fetch_res && isRequest(fetch_res)) {
                  fetch_res = await enhanced_fetch(fetch_res)
                }
              } catch (err) {
                const msg = `An error occurded proxying a request returned from the FAB: \nError:\n${err}\nRequest:\n${fetch_res}`
                console.error(msg)
                return res.status(500).send(msg)
              }

              if (!fetch_res) {
                const msg = `Nothing was returned from the FAB renderer.`
                console.error(msg)
                return res.status(500).send(msg)
              }
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

              const shouldSetChunkedTransferEncoding =
                !response_headers['content-length'] &&
                !response_headers['transfer-encoding']
              const body = fetch_res.body
              if (body) {
                if (typeof body.getReader === 'function') {
                  if (shouldSetChunkedTransferEncoding)
                    res.set('transfer-encoding', 'chunked')

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
                  if (shouldSetChunkedTransferEncoding)
                    res.set('transfer-encoding', 'chunked')

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
          } catch (e) {
            console.log('ERROR')
            console.log(e)
            if (!res.headersSent) {
              res.writeHead(500, 'Internal Error')
            }
            res.end()
          }

          log(`🖤${req.url}🖤`)
        })

        if (!server) {
          if (watching) log.note(`Watching 💛${this.filename}💛 for changes...`)
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

    if (watching) {
      await watcher([this.filename], bootServer, {
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 50,
        },
      })
    } else {
      await bootServer()
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
