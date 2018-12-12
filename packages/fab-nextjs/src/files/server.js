const next = require('next-server')
const MockExpressResponse = require('./mock-express-response')
const fs = require('fs')
const url = require('url')

const initFiles = require('./includes')
global.NEXT_CACHE = require('./next-cache')

let startup_promise
const serverOptions = {}

const startup = () => {
  if (startup_promise) return startup_promise
  startup_promise = new Promise(async (resolve, reject) => {
    try {
      await initFiles()
      //const files = await new Promise(res =>
      //  fs.readdir('/.next', (_, files) => res(files))
      //)
      //console.log(files)
      const app = next(serverOptions)
      await app.prepare()
      resolve(app.getRequestHandler())
    } catch (e) {
      reject(e)
    }
  })
  return startup_promise
}
startup().then(() => console.log(`Booted and ready!`))

const render = async (req, settings) => {
  console.log(`REQUEST! ${req.url}`)
  const requestHandler = await startup()
  const res = new MockExpressResponse()
  const req_url = url.parse(req.url)
  const { path } = req_url

  const local_req = new Request(path, {
    method: req.method,
    headers: req.headers
  })
  await requestHandler(local_req, res)
  return new Response(res._getString(), {
    status: res.statusCode,
    headers: res._headers
  })
}

module.exports = { render }
