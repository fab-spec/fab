/*
 * FAB Wrapper
 *
 * Entry point for the FAB Webpack build
 * Maps the simplified index.fab.js to the FAB spec
 *
 * */

const url = require('url')
const render_app = require('app-index').render
const production_settings = require('production-settings.json')
const rewrites = FAB_REWRITES
const mime = require('mime-types')

const getContentType = pathname => {
  const mimeType = mime.lookup(pathname)
  return (mimeType && mime.contentType(mimeType)) || 'text/html; charset=utf-8'
}

const excludedHeaders = new Set([
  'cache-control',
  'connection',
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
const excludedHeaderPrefixes = [/^x-amz-cf-/i, /^x-amzn-/i, /^x-edge-/i]

const render = async (req, settings) => {
  const parsed = url.parse(req.url)
  const { path, protocol, host } = parsed

  const rewrite = rewrites[path]
  if (rewrite) {
    const response = await fetch(`${protocol}//${host}${rewrite}`)

    // Delete excluded headers
    const headers = {}
    for (const [header, value] of response.headers.entries()) {
      if (excludedHeaders.has(header.toLowerCase())) continue
      if (excludedHeaderPrefixes.some(prefix => prefix.exec(header))) continue
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
  return await render_app(req, settings)
}

module.exports = {
  render,
  getProdSettings() {
    return production_settings
  }
}
