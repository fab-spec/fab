const next = require('next-server')
const MockExpressResponse = require('./mock-express-response')
const initFiles = require('./includes')
const fs = require('fs')
const url = require('url')

global.NEXT_CACHE = {}

let startup_promise
const serverOptions = {}

const startup = () => {
  if (startup_promise) return startup_promise
  startup_promise = new Promise(async (resolve, reject) => {
    try {
      await initFiles()
      const files = await new Promise(res =>
        fs.readdir('/.next', (_, files) => res(files))
      )
      console.log(files)
      const app = next(serverOptions)
      await app.prepare()
      resolve(app.getRequestHandler())
    } catch (e) {
      reject(e)
    }
  })
  return startup_promise
}

const render = async (req, settings) => {
  const requestHandler = await startup()
  const res = new MockExpressResponse()
  const req_url = url.parse(req.url)
  const { path } = req_url

  const local_req = new Request(path, {
    method: req.method,
    headers: req.headers
  })
  const body = await requestHandler(local_req, res)
  return new Response(body, {
    status: res.statusCode,
    headers: res._headers
  })
}

module.exports = { render }
