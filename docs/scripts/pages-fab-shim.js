import FAB from '../.fab/build/server.js'
const server_context = { bundle_id: 'nobeuno' }
const LOOPBACK_URL = 'https://127.0.0.1'

const mutableResponse = (response) => new Response(response.body, response)

function ReadableStream({ start, cancel }) {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  start({
    enqueue(chunk) {
      if (typeof chunk === 'string') {
        writer.write(encoder.encode(chunk))
      } else if (ArrayBuffer.isView(chunk)) {
        writer.write(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength))
      } else {
        writer.write(chunk)
      }
    },
    close() {
      writer.close()
    },
  })

  return readable
}

globalThis.orig_fetch = globalThis.fetch

const assetFetch = async (pathname, init) => {
  //console.log(pathname, init)
  return await __ASSETS.fetch(
    pathname.startsWith('/') ? `${LOOPBACK_URL}${pathname}` : pathname,
    init
  )
}

globalThis.fetch = (request, init) => {
  const request_url = typeof request === 'string' ? request : request.url

  if (request_url.startsWith('/')) {
    if (!request_url.startsWith('/_assets/')) {
      const loopback_url = new Request(`${LOOPBACK_URL}${request_url}`, init)
      return handleRequest(loopback_url).then(mutableResponse)
    } else {
      return assetFetch(request_url).then(mutableResponse)
    }
  } else {
    return orig_fetch(request, init).then(mutableResponse)
  }
}
globalThis._Request = globalThis.Request
globalThis.Request = class extends Request {
  constructor(url, init) {
    //console.log({ url, init })
    if (typeof url === 'string' && url.startsWith('/')) {
      super(`${LOOPBACK_URL}${url}`, init)
    } else {
      super(url, init)
    }
  }
}

if (typeof FAB.initialize === 'function') FAB.initialize(server_context)

const handleRequest = async (request, within_loop = false) => {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/_assets/')) {
    return await assetFetch(url.pathname)
  } else {
    let settings = FAB.getProdSettings ? FAB.getProdSettings() : {}
    if (settings.then && typeof settings.then == 'function') {
      settings = await settings
    }

    const result = await FAB.render(request, settings)
    if (result instanceof Request) {
      //console.log({ request: result.url })
      if (result.url.startsWith(`${LOOPBACK_URL}/`)) {
        if (!result.url.startsWith(`${LOOPBACK_URL}/_assets/`)) {
          if (within_loop) throw new Error('Loop detected!')
          return await handleRequest(result, true)
        } else {
          return await assetFetch(result.url)
        }
      } else {
        return await globalThis.orig_fetch(request)
      }
    }

    if (result.body && typeof result.body.getReadable === 'function') {
      return new Response(result.body.getReadable(), result)
    }
    return result
  }
}

export default {
  async fetch(request, env, ctx) {
    globalThis.__ASSETS = env.ASSETS
    return handleRequest(request)
  },
}
