import * as fs from 'async-file'
import * as path from 'path'
import * as http from 'http'
import * as url from 'url'
import * as vm from 'vm'
import * as mime from 'mime-types'
import * as fetch from 'node-fetch'

const getContentType = (pathname: string) => {
  const mimeType = mime.lookup(pathname)
  return (mimeType && mime.contentType(mimeType)) || 'text/html; charset=utf-8'
}

const mapToObj = (map: Map<string, string>) => {
  const obj: { [index: string]: string } = {}
  return [...map.entries()].reduce(
    (obj, [key, value]) => ((obj[key] = value), obj),
    obj
  )
}

export default class Server {
  private file: string
  private port: string

  constructor(file: string, port: string) {
    this.file = file
    this.port = port
  }

  async start() {
    const dir = path.dirname(this.file)
    const src = await fs.readFile(`${dir}/server/bundle.js`, 'utf8')

    const { Request } = fetch

    const sandbox = {
      fetch: fetch,
      Request: fetch.Request,
      Response: fetch.Response,
      Headers: fetch.Headers,
      URL: URL,
      console: {
        log: console.log
      },
      NODE_ENV: 'server',
      process: {
        env: {
          NODE_ENV: 'server'
        }
      }
    }

    const script = new vm.Script(src)
    const exp = {}
    const ctx = Object.assign({}, sandbox, { module: { exports: exp } })
    const renderer = script.runInNewContext(ctx)

    return await new Promise((resolve, reject) => {
      http
        .createServer(async (req, res) => {
          try {
            const pathname = url.parse(req.url!).pathname!
            if (pathname.startsWith('/_assets')) {
              const data = await fs.readFile(`${dir}${pathname}`)
              res.setHeader('Content-Type', getContentType(pathname))
              res.end(data)
            } else {
              const method = req.method
              const headers: any = req.headers
              const url = `https://${req.headers.host}${req.url}`
              const fetch_req = new Request(url, {
                method,
                headers
              })
              const fetch_res = await renderer.render(fetch_req, {
                injected: 'variables',
                should: 'work!'
              })
              console.log({ fetch_res })
              res.writeHead(
                fetch_res.status,
                fetch_res.statusText,
                mapToObj(fetch_res.headers)
              )
              const blob = await fetch_res.arrayBuffer()
              res.write(new Buffer(blob))
              res.end()
            }
          } catch (e) {
            reject(e)
          }
        })
        .listen(this.port, resolve)
    })
  }

  static async start(file: string, port: string) {
    const server = new Server(file, port)
    return await server.start()
  }
}
