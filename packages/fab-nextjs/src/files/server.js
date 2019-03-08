//const MockExpressResponse = require('./mock-express-response')
import url from 'url'

const renderers = require('./renderers')

export const render = async (req, settings) => {
  console.log(`REQUEST! ${req.url}`)
  const res = {}
  const req_url = url.parse(req.url)
  const { path } = req_url
  console.log({path})

  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
    headers: {}
  })
  //const local_req = new Request(path, {
  //  method: req.method,
  //  headers: req.headers
  //})
  //await requestHandler(local_req, res)
  //return new Response(res._getString(), {
  //  status: res.statusCode,
  //  headers: res._headers
  //})
}
