// @ts-ignore
import __generated from 'generated-nextjs-renderers.js'
import { pathToRegexp } from 'path-to-regexp'
import { FABRuntime, NO_RESPONSE_STATUS_CODE, Priority } from '@dev-spendesk/core'

const { renderers, MockExpressResponse, MockReq } = __generated

type Renderer = {
  render?: Function
  default?: Function
}

async function invokeRenderer(
  renderer: Renderer,
  request: Request,
  route: string,
  protocol: string
) {
  try {
    const local_req = new MockReq({
      url: route,
      method: request.method,
      headers: request.headers,
      connection: {
        encrypted: protocol === 'https',
      },
      body: request.body,
    })
    const response = new MockExpressResponse({
      request: local_req,
    })
    console.log({ renderer })
    if (typeof renderer.render === 'function') {
      await renderer.render(local_req, response)
    } else if (typeof renderer.default === 'function') {
      await renderer.default(local_req, response)
      // console.log(response)
    } else {
      throw new Error(`NextJS renderer doesn't export 'render' or 'default'`)
    }
    // @ts-ignore
    return new Response(response._getString(), {
      status: response.statusCode,
      // @ts-ignore
      headers: response._headers,
    })
  } catch (e) {
    console.error(e)
    return new Response(`ERROR: NextJS renderer crashed\n${e}`, { status: 500 })
  }
}

export default function InputNextJsRuntime({ Router }: FABRuntime) {
  const pathRenderers: { [path: string]: Renderer } = {}
  const regexpRenderers: { path_matcher: RegExp; renderer: Renderer }[] = []
  let errorRenderer: Renderer | undefined

  Object.keys(renderers).forEach((path) => {
    if (path === '/_error') {
      errorRenderer = renderers[path]
    } else if (path.match(/{:/)) {
      regexpRenderers.push({
        path_matcher: pathToRegexp(path),
        renderer: renderers[path],
      })
    } else {
      pathRenderers[path] = renderers[path]
    }
  })
  // console.log({ pathRenderers })
  // console.log({ regexpRenderers })
  // console.log({ errorRenderer })

  const getRenderer = (request_path: string) => {
    const exact_match = pathRenderers[request_path]
    if (exact_match) return exact_match

    for (const { path_matcher, renderer } of regexpRenderers) {
      if (path_matcher.exec(request_path)) return renderer
    }

    return undefined
  }

  Router.onAll(async function responder({ request, url }) {
    //   global.FAB_SETTINGS = settings
    // console.log(`REQUEST! ${url}`)
    const { pathname, protocol } = url

    const renderer = pathname === '/' ? getRenderer('/index') : getRenderer(pathname)
    // console.log({ renderer })
    if (renderer) {
      return await invokeRenderer(renderer, request, pathname, protocol)
    }

    if (!errorRenderer) return undefined

    return {
      async interceptResponse(response: Response) {
        return response.status === NO_RESPONSE_STATUS_CODE
          ? await invokeRenderer(errorRenderer as Renderer, request, pathname, protocol)
          : response
      },
    }
  }, Priority.LATER)
}
