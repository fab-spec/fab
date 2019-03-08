const MockExpressResponse = require('./mock-express-response')
import url from 'url'

const RENDERERS = require('./renderers')

export const render = async (req, settings) => {
  console.log(`REQUEST! ${req.url}`)
  const res = new MockExpressResponse()
  const req_url = url.parse(req.url)
  const { path } = req_url
  console.log({path})

  const renderer = RENDERERS[path] || RENDERERS[path + 'index']
  console.log({renderer})
  if (renderer) {
    const local_req = new Request(path, {
      method: req.method,
      headers: req.headers
    })
    await renderer.render(local_req, res)
    return new Response(res._getString(), {
      status: res.statusCode,
      headers: res._headers
    })
  }

  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
    headers: {}
  })
}
