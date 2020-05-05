const FAB = globalThis.__fab // injected by UMD
const ASSETS_URL = globalThis.__assets_url // inlined in packager
const cache = caches.default
const server_context = globalThis.__server_context // inlined in packager

globalThis.orig_fetch = globalThis.fetch
globalThis.fetch = (url, init) => {
  const request_url = typeof url === 'string' ? url : url.url
  console.log({ request_url })

  const makeResponseMutable = (response) => new Response(response.body, response)

  if (request_url.startsWith('/')) {
    if (!request_url.startsWith('/_assets/')) {
      throw new Error('Fetching relative URLs for non-assets is not permitted.')
    }
    return orig_fetch(`${ASSETS_URL}${request_url}`, init).then(makeResponseMutable)
  }

  return orig_fetch(url, init).then(makeResponseMutable)
}

if (typeof FAB.initialize === 'function') FAB.initialize(server_context)

const handleRequest = async (request) => {
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
          throw new Error('Fetching relative URLs for non-assets is not permitted.')
        }
        const asset_url = ASSETS_URL + result.url
        return await globalThis.orig_fetch(asset_url)
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
