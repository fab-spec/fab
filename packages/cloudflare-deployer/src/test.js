const path = require('path')
const fetch = require('node-fetch')

global.fetch = fetch
global.Request = fetch.Request
global.Headers = fetch.Headers
global.Response = fetch.Response
global.BASE_URL = 'https://app.linc.sh'
const handler = require(path.join(__dirname, '..', 'tmp', 'server', 'assetHandler'))

const run = async () => {
  const url =
    'https://someworker.com/_assets/_public/static/media/extension.ab2c457c.ab2c457c7.jpg'
  const response = await handler(
    new Request(url, { headers: { Accept: '*/*, image/webp' } })
  )
  const text = await response.text()
  const headers = response.headers.raw()
  console.log({ headers, text })
}

run()
