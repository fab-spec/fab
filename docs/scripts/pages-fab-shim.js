import FAB from '../.fab/build/server.js'
const ASSETS_URL = globalThis.__assets_url // inlined in packager
const server_context = { bundle_id: 'nobeuno' }

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
  return await __ASSETS.fetch(`https://no.existo/${pathname}`, init)
}

globalThis.fetch = (request, init) => {
  const request_url = typeof request === 'string' ? request : request.url

  if (request_url.startsWith('/')) {
    if (!request_url.startsWith('/_assets/')) {
      const loopback_url = new Request(`https://loopback${request_url}`, init)
      return handleRequest(loopback_url).then(mutableResponse)
    } else {
      return assetFetch(request_url).then(mutableResponse)
    }
  } else {
    return orig_fetch(request, init).then(mutableResponse)
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
      if (result.url.startsWith('/')) {
        if (!result.url.startsWith('/_assets/')) {
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
