// @ts-ignore
import renderers from 'generated-nextjs-renderers.js'

// @ts-ignore
import MockExpressResponse from './mock-express-response'
import { parse } from 'url'
import { pathToRegexp } from 'path-to-regexp'

type Renderer = () => {}

const pathRenderers: { [path: string]: Renderer } = {}
const regexpRenderers: { path_matcher: RegExp; renderer: Renderer }[] = []
Object.keys(renderers).forEach((path) => {
  if (path.match(/{:/)) {
    regexpRenderers.push({
      path_matcher: pathToRegexp(path),
      renderer: renderers[path],
    })
  } else {
    pathRenderers[path] = renderers[path]
  }
})
console.log({ pathRenderers })
console.log({ regexpRenderers })

// const getRenderer = (request_path) => {
//   const exact_match = pathRenderers[request_path]
//   if (exact_match) return exact_match
//
//   for (const { path_matcher, renderer } of regexpRenderers) {
//     if (path_matcher.exec(request_path)) return renderer
//   }
// }
//
//
// const _render = async (request, settings) => {
//   global.FAB_SETTINGS = settings
//   console.log(`REQUEST! ${request.url}`)
//   const req_url = parse(request.url)
//
//   const route = await SERVER.route(settings, req_url.path, request)
//
//   // Routing to something falsy means a 404
//   if (!route) return render404()
//
//   // Routing to anything other than a simple string, we just return it
//   if (typeof route !== 'string') return route
//
//   // Routing to an absolute URL we'll proxy the request
//   const parsed_route = parse(route)
//   if (parsed_route.hostname) return proxyRequest(request, route)
//
//   const { pathname } = parsed_route
//   console.log({ pathname })
//
//   const renderer = pathname === '/' ? getRenderer('/index') : getRenderer(pathname)
//   console.log({ renderer })
//
//   if (renderer) {
//     if (typeof renderer === 'string') {
//       return new Response(renderer, {
//         status: 200,
//         statusText: 'OK',
//         headers: {
//           'Content-Type': 'text/html',
//         },
//       })
//     } else if (typeof renderer.runtime === 'function') {
//       const local_req = {
//         url: route,
//         method: request.method,
//         headers: request.headers,
//         connection: {
//           encrypted: req_url.protocol === 'https',
//         },
//       }
//       const response = new MockExpressResponse({
//         request: local_req,
//       })
//       await renderer.runtime(local_req, response)
//       return new Response(response._getString(), {
//         status: response.statusCode,
//         headers: response._headers,
//       })
//     }
//   }
//
//   return render404()
// }
//

export function runtime() {
  console.log(renderers)
  return async function responder() {}
}
