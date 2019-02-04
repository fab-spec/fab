/*
 * Static FAB Wrapper
 *
 * Entry point for the Static FAB Webpack build
 *
 * */

import url from 'url'
import htmls from './htmls'
import * as default_server from './default-app-server'
import * as server_overrides from 'app-server'

const SERVER = {
  ...default_server,
  ...server_overrides
}

export const render = async (request, settings) => {
  await SERVER.modifyRequest(settings, request)
  const response = await _render(request, settings)
  await SERVER.modifyResponse(settings, response)
  return response
}

async function _render(request, settings) {
  const req_url = url.parse(request.url)

  const route = await SERVER.route(settings, req_url.path, request)

  // Routing to something falsy means a 404
  if (!route) return render404()

  // Routing to anything other than a simple string, we just return it
  if (typeof route !== 'string') return route

  // Routing to an absolute URL we'll proxy the request
  const parsed_route = url.parse(route)
  if (parsed_route.hostname) return proxyRequest(request, route)

  const path = parsed_route.path
  const matched_html =
    htmls[path] ||
    htmls[path + (path.endsWith('/') ? '' : '/') + 'index.html'] ||
    (path.match(/\/[^.^\/]+$/) && htmls[path + '.html']) ||
    htmls['/index.html']

  // Couldn't find a matching HTML file, return a 404
  if (!matched_html) return render404()

  // Otherwise render the 404 with our settings injected
  const headers = {}
  headers['content-type'] = 'text/html'

  const rendered_html = matched_html({
    FAB_ENV_INJECTION: `<script>window.FAB_SETTINGS=${JSON.stringify(settings)};</script>`,
    FAB_NONCE: 'noncey'
  })

  return new Response(rendered_html, {
    status: 200,
    statusText: 'OK',
    headers
  })
}

function proxyRequest(request, url) {
  return fetch(url, {
    headers: request.headers,
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
