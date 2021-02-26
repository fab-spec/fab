const FAB = globalThis.__fab // injected by UMD
const ASSETS_URL = globalThis.__assets_url // inlined in packager
const cache = caches.default
const server_context = globalThis.__server_context // inlined in packager
const env_overrides = globalThis.__env_overrides // inlined in packager

const USES_KV_STORE = ASSETS_URL.startsWith('kv://')
const KV_STORE = globalThis.KV_FAB_ASSETS
if (USES_KV_STORE && !KV_STORE) {
  throw new Error(
    `Asset URL (${ASSETS_URL}) points at KV store but no binding (KV_FAB_ASSETS) found!`
  )
}

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

class Cache {
  async set(key, value, ttl_seconds) {
    return KV_FAB_CACHE.put(
      key,
      value,
      ttl_seconds ? { expirationTtl: ttl_seconds } : undefined
    )
  }
  async setJSON(key, value, ttl_seconds) {
    await this.set(key, JSON.stringify(value), ttl_seconds)
  }
  async get(key) {
    return KV_FAB_CACHE.get(key)
  }
  async getJSON(key) {
    return KV_FAB_CACHE.get(key, 'json')
  }
  async getArrayBuffer(key) {
    return KV_FAB_CACHE.get(key, 'arrayBuffer')
  }
  async getNumber(key) {
    return KV_FAB_CACHE.get(key, 'json')
  }
  async getStream(key) {
    return KV_FAB_CACHE.get(key, 'stream')
  }
}

const HAS_KV_CACHE = typeof globalThis.KV_FAB_CACHE !== 'undefined'
console.log({ KV_FAB_CACHE: globalThis.KV_FAB_CACHE })
if (HAS_KV_CACHE) server_context.cache = new Cache()

globalThis.orig_fetch = globalThis.fetch

const assetFetch = async (pathname, init) => {
  if (USES_KV_STORE) {
    const { value, metadata } = await KV_STORE.getWithMetadata(pathname, 'stream')
    return new Response(value, {
      headers: {
        'content-type': metadata.content_type,
        'cache-control': 'public, max-age=31536000, immutable',
      },
    })
  } else {
    return await orig_fetch(`${ASSETS_URL}${pathname}`, init)
  }
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
    let prodSettings = FAB.getProdSettings ? FAB.getProdSettings() : {}
    if (prodSettings.then && typeof prodSettings.then == 'function') {
      prodSettings = await prodSettings
    }
    const settings = Object.assign({}, prodSettings, env_overrides)

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

addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (url.protocol === 'https:') {
    const promise = handleRequest(request)
    event.respondWith(promise)
  } else {
    url.protocol = 'https:'
    event.respondWith(
      new Response('Redirecting to https', {
        status: 301,
        headers: {
          location: url.href,
        },
      })
    )
  }
})
