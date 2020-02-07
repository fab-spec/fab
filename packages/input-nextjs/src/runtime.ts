// @ts-ignore
import renderers from 'generated-nextjs-renderers.js'
// @ts-ignore
import MockExpressResponse from './mock-express-response'
import { pathToRegexp } from 'path-to-regexp'
import { FabRequestResponder } from '@fab/core'

type Renderer = () => {}

export function runtime() {
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

  const getRenderer = (request_path: string) => {
    const exact_match = pathRenderers[request_path]
    if (exact_match) return exact_match

    for (const { path_matcher, renderer } of regexpRenderers) {
      if (path_matcher.exec(request_path)) return renderer
    }

    return undefined
  }

  console.log(renderers)
  return async function responder({ request, url }) {
    //   global.FAB_SETTINGS = settings
    console.log(`REQUEST! ${url}`)
    const { pathname } = url

    const renderer = pathname === '/' ? getRenderer('/index') : getRenderer(pathname)
    console.log({ renderer })
    const route = pathname

    if (renderer) {
      try {
        const local_req = {
          url: route,
          method: request.method,
          headers: request.headers,
          connection: {
            encrypted: url.protocol === 'https',
          },
        }
        const response = new MockExpressResponse({
          request: local_req,
        })
        // @ts-ignore
        await renderer.runtime(local_req, response)
        // @ts-ignore
        return new Response(response._getString(), {
          status: response.statusCode,
          // @ts-ignore
          headers: response._headers,
        })
      } catch (e) {
        return new Response(`ERROR: NextJS renderer crashed\n${e}`)
      }
    }

    return undefined
  } as FabRequestResponder
}
