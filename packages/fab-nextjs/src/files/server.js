import MockExpressResponse from './mock-express-response'
import url, { parse } from 'url'

import * as default_server from './default-app-server'
import * as server_overrides from 'app-server'

const SERVER = {
  ...default_server,
  ...server_overrides
}

const RENDERERS = require('./renderers')

export const render = async (request, settings) => {
  await SERVER.modifyRequest(settings, request)
  const response = await _render(request, settings)
  await SERVER.modifyResponse(settings, response)
  return response
}

const _render = async (req, settings) => {
  console.log(`REQUEST! ${req.url}`)
  const res = new MockExpressResponse()
  const req_url = url.parse(req.url)

  const route = await SERVER.route(settings, req_url.path, request)

  // Routing to something falsy means a 404
  if (!route) return render404()

  // Routing to anything other than a simple string, we just return it
  if (typeof route !== 'string') return route

  // Routing to an absolute URL we'll proxy the request
  const parsed_route = parse(route)
  if (parsed_route.hostname) return proxyRequest(request, route)

  const path = parsed_route.path
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

  return render404()
}


function proxyRequest(request, url) {
  const { protocol, host } = parse(url)

  // Ensure host and origin headers are set appropriately
  const headers = new Headers(request.headers)
  headers.delete('host')
  if (headers.get('origin')) headers.set('origin', `${protocol}//${host}`)

  return fetch(url, {
    headers,
    method: request.method,
    ...(request.method === 'POST' ? { body: request.body } : {})
  })
}

function render404() {
  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
    headers: {}
  })
}
