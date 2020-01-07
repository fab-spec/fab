import fs from 'fs-extra'

import { ServerArgs, SandboxType, getContentType } from '@fab/core'
import { InvalidConfigError } from '@fab/cli'
import { readFilesFromZip } from './utils'
import v8_sandbox from './sandboxes/v8-isolate'
import node_vm_sandbox from './sandboxes/node-vm'
import url from 'url'
import http from 'http'
import express from 'express'
import concat from 'concat-stream'

export default class Server {
  private filename: string
  private port: number

  constructor(filename: string, args: ServerArgs) {
    this.filename = filename
    this.port = parseInt(args.port)

    //  TODO: cert stuff

    if (isNaN(this.port)) {
      throw new InvalidConfigError(`Invalid port, expected a number, got '${args.port}'`)
    }
  }

  async serve(runtimeType: SandboxType) {
    if (!(await fs.pathExists(this.filename))) {
      throw new InvalidConfigError(`Could not find file '${this.filename}'`)
    }

    const files = await readFilesFromZip(this.filename)
    console.log(files)

    const src_buffer = files['/server.js']
    if (!src_buffer) {
      throw new InvalidConfigError('Malformed FAB. Missing /server.js')
    }
    const src = src_buffer.toString('utf8')

    const renderer =
      (await runtimeType) === SandboxType.v8isolate
        ? await v8_sandbox(src)
        : await node_vm_sandbox(src)

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
          const pathname = url.parse(req.url!).pathname!
          if (pathname.startsWith('/_assets')) {
            res.setHeader('Content-Type', getContentType(pathname))
            res.setHeader('Cache-Control', 'immutable')
            res.end(files[pathname])
          } else {
            const method = req.method
            const headers: any = req.headers
            const url = `${req.protocol}://${req.headers.host}${req.url}`
            const fetch_req = new Request(url, {
              method,
              headers,
              ...(method === 'POST' ? { body: req.body } : {}),
            })

            const production_settings = renderer.getSettings
              ? renderer.getSettings('production')
              : {}
            const fetch_res = await renderer.render(
              fetch_req,
              Object.assign(
                {
                  injected: 'variables',
                  should: 'work!',
                },
                production_settings
              )
            )
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
            const blob = await fetch_res.arrayBuffer()
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
  }
}
