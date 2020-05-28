const FAB = globalThis.__fab // injected by UMD
const ASSETS_URL = globalThis.__assets_url // inlined in packager
const cache = caches.default
const server_context = globalThis.__server_context // inlined in packager

const mutableResponse = (response) => new Response(response.body, response)

globalThis.orig_fetch = globalThis.fetch
globalThis.fetch = (request, init) => {
  const request_url = typeof request === 'string' ? request : request.url

  if (request_url.startsWith('/')) {
    if (!request_url.startsWith('/_assets/')) {
      const loopback_url = new Request(`https://loopback${request_url}`, init)
      return handleRequest(loopback_url).then(mutableResponse)
    } else {
      return orig_fetch(`${ASSETS_URL}${request_url}`, init).then(mutableResponse)
    }
  } else {
    return orig_fetch(request, init).then(mutableResponse)
  }
}

if (typeof FAB.initialize === 'function') FAB.initialize(server_context)

const handleRequest = async (request, within_loop = false) => {
  console.log({ request })
  console.log(request.url)
  const url = new URL(request.url)
  if (url.pathname.startsWith('/_assets/')) {
    const asset_url = ASSETS_URL + url.pathname
    return await globalThis.orig_fetch(asset_url)
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
          const asset_url = ASSETS_URL + result.url
          return await globalThis.orig_fetch(asset_url)
        }
      } else {
        return await globalThis.orig_fetch(request)
      }
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
