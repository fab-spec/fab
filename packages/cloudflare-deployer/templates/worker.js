const fab = require('./server.js')
const assetHandler = require('./assetHandler.js')

let prodSettings = undefined
const cache = caches.default

global.orig_fetch = global.fetch

let patchedFetch = false

const patchGlobalFetch = (origin) => {
  if (!patchedFetch) {
    global.fetch = async (resource, init) => {
      let fetch_url = resource
      if (resource instanceof Request) {
        fetch_url = resource.url
      }
      if (fetch_url.startsWith('/')) {
        let fetchReq = resource
        if (typeof resource === 'string') {
          fetchReq = new Request(resource)
        }
        fetchReq.url = origin + fetch_url
        return await handleRequest(fetchReq)
      } else {
        return global.orig_fetch(resource, init)
      }
    }
    patchedFetch = true
  }
}

const handleFabRequest = async (request) => {
  if (!prodSettings) {
    prodSettings = fab.getProdSettings ? await fab.getProdSettings() : {}
  }
  const result = await fab.render(request, prodSettings)
  if (result instanceof Request) {
    if (result.url.startsWith('/')) {
      return await handleRequest(result)
    } else {
      return await fetch(request)
    }
  } else if (result instanceof Response) {
    return result
  } else {
    throw new Error(`unknown response from fab.render: ${result}`)
  }
}

const handleRequest = async (request) => {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/_assets/')) {
    return assetHandler(request)
  } else {
    return handleFabRequest(request)
  }
}

const handleCache = async (request) => {
  let response = await cache.match(request)
  if (response) {
    return event.respondWith(response)
  } else {
    const response = event.respondWith(handleRequest(request))
    cache.put(request, response)
    return response
  }
}

const redirectToHttps = (url) => {
  url.protocol = 'https:'
  return new Response('Redirecting to https', {
    status: 301,
    headers: {
      location: url.href,
    },
  })
}

addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  patchGlobalFetch(url.origin)
  if (url.protocol === 'https:') {
    event.respondWith(handleCache(request))
  } else {
    event.respondWith(redirectToHttps(url))
  }
})
