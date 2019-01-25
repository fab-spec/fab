import * as mime from 'mime-types'

const getContentType = pathname => {
  const mimeType = mime.lookup(pathname)
  return (mimeType && mime.contentType(mimeType)) || 'text/html; charset=utf-8'
}

const excludedHeaders = new Set([
  'cache-control',
  'connection',
  'content-encoding',
  'content-length',
  'expect',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'trailer',
  'upgrade',
  'x-accel-buffering',
  'x-accel-charset',
  'x-accel-limit-rate',
  'x-accel-redirect',
  'x-cache',
  'x-forwarded-proto',
  'x-real-ip'
])

export const fetchAndReturn = async (url: string) => {
  const response = await fetch(url)

  // Delete excluded headers
  const headers: {[header: string]: string} = {}
  for (const [header, value] of response.headers.entries()) {
    if (excludedHeaders.has(header.toLowerCase())) continue
    headers[header] = value
  }

  // Add mime types if not already present
  if (!headers['content-type']) headers['content-type'] = getContentType(path)

  return new Response(await response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}
