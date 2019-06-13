import MockExpressResponse from './mock-express-response'
import { parse } from 'url'

import * as default_server from './default-app-server'
import * as server_overrides from 'app-server'

const SERVER = {
  ...default_server,
  ...server_overrides,
}

const RENDERERS = require('./renderers')

export const render = async (request, settings) => {
  await SERVER.modifyRequest(settings, request)
  const response = await _render(request, settings)
  await SERVER.modifyResponse(settings, response)
  return response
}

const _render = async (request, settings) => {
  global.FAB_SETTINGS = settings
  console.log(`REQUEST! ${request.url}`)
  const req_url = parse(request.url)

  const route = await SERVER.route(settings, req_url.path, request)

  // Routing to something falsy means a 404
  if (!route) return render404()

  // Routing to anything other than a simple string, we just return it
  if (typeof route !== 'string') return route

  // Routing to an absolute URL we'll proxy the request
  const parsed_route = parse(route)
  if (parsed_route.hostname) return proxyRequest(request, route)

  const { pathname } = parsed_route
  console.log({ pathname })

  const renderer = pathname === '/' ? RENDERERS['/index'] : RENDERERS[pathname]
  console.log({ renderer })
  if (renderer) {
    const local_req = {
      url: route,
      method: request.method,
      headers: request.headers,
      connection: {
        encrypted: req_url.protocol === 'https',
      },
    }
    const response = new MockExpressResponse({
      request: local_req,
    })
    await renderer.render(local_req, response)
    return new Response(response._getString(), {
      status: response.statusCode,
      headers: response._headers,
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
    ...(request.method === 'POST' ? { body: request.body } : {}),
  })
}

function render404() {
  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
    headers: {},
  })
}
