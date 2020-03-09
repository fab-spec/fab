const assets = require('./assets_manifest.json')

module.exports = async (request) => {
  const pathname = new URL(request.url).pathname
  const accept = request.headers.get('Accept')
  if (accept && accept.includes('image/webp')) {
    const dotIndex = pathname.lastIndexOf('.')
    const ext = pathname.slice(dotIndex + 1)
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
      const newpath = `${pathname.slice(0, dotIndex)}.webp`
      if (assets[newpath]) {
        return new Request(BASE_URL + newpath)
      }
    }
  }

  const url = BASE_URL + pathname
  return new Request(url)
}
