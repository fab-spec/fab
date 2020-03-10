const fab = require('./server.js')
const assetHandler = require('./assetHandler.js')

let prodSettings = undefined
const cache = caches.default

global.orig_fetch = global.fetch
global.fetch = async (resource, init) => {
  let fetch_url = resource
  if (resource instanceof Request) {
    fetch_url = resource.url
  }
  if (fetch_url.startsWith('/_assets/')) {
    let fetchReq = resource
    if (typeof resource === 'string') {
      fetchReq = new Request(resource)
    }
    fetchReq.url = `https://localfabassets${fetch_url}`
    return await handleCache(fetchReq)
  } else {
    return global.orig_fetch(resource, init)
  }
}

const handleFabRequest = async (request) => {
  if (!prodSettings) {
    prodSettings = fab.getProdSettings ? await fab.getProdSettings() : {}
  }
  const result = await fab.render(request, prodSettings)
  if (result instanceof Request) {
    if (result.url.startsWith('/')) {
      const url = new URL(request.url)
      result.url = url.origin + result.url
      return await handleCache(result)
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
    return response
  } else {
    const response = await handleRequest(request)
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
  if (url.protocol === 'https:') {
    event.respondWith(handleCache(request))
  } else {
    event.respondWith(redirectToHttps(url))
  }
})
