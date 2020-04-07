const FAB = __fab // injected by UMD
const ASSETS_URL = INJECTED_ASSETS_URL // inlined in packager

const handleRequest = async (request) => {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/_assets/')) {
    const asset_url = ASSETS_URL + url.pathname
    return await fetch(asset_url)
  } else {
    let settings = FAB.getProdSettings ? FAB.getProdSettings() : {}
    if (settings.then && typeof settings.then == 'function') {
      settings = await settings
    }
    return await FAB.render(request, settings)
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
