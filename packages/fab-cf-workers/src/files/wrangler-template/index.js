const fab = require('./server.js')
const s3_bucket_name = require('./s3-bucket-name')
const asset_base_url = `https://${s3_bucket_name}.s3.amazonaws.com`

const handleRequest = async (request) => {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/_assets/')) {
    const asset_url = asset_base_url + url.pathname
    console.log({asset_url})
    return await fetch(asset_url)
  } else {
    let settings = fab.getProdSettings ? fab.getProdSettings() : {}
    if (settings.then && typeof settings.then == 'function') {
      settings = await settings
    }
    return await fab.render(request, settings)
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
