/*
* FAB Wrapper
*
* Entry point for the FAB Webpack build
* Maps the simplified index.fab.js to the FAB spec
*
* */

const MockExpressResponse = require('./mock-express-response')
const render_app = require('app-index').default
const url = require('url')

const render = async (req, settings) => {
  const res = new MockExpressResponse()
  const req_url = url.parse(req.url)
  const { path } = req_url

  if (path.startsWith('/static') || path.endsWith('.ico') || path.endsWith('.txt')) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/_assets${path}`
      }
    })
  }

  const local_req = new Request(path, {
    method: req.method,
    headers: req.headers
  })
  const body = await render_app(local_req, res, settings)
  return new Response(body, {
    status: res.statusCode,
    headers: res._headers
  })
}

module.exports = { render }
