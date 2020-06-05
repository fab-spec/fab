const URL = require('url').URL
const node_fetch = require('./vendor/node-fetch.2.3.0')
const NodeCache = require('./vendor/node-cache.5.1.0')
const fab = require('./server')
const PACKAGED_CONFIG = require('./packaged_config')

const prodSettings = fab.getProdSettings ? fab.getProdSettings() : {}
const settings = Object.assign({}, prodSettings, PACKAGED_CONFIG.env_overrides)

//Need to set this to work around a bug in a dependency of the webpack http(s) shim
global.location = { protocol: 'https:' }

const enhanced_fetch = (url, init) => {
  const request_url = typeof url === 'string' ? url : url.url
  console.log({ request_url })
  if (request_url.startsWith('/')) {
    if (!request_url.startsWith('/_assets/')) {
      throw new Error('Fetching relative URLs for non-assets is not permitted.')
    }
    return node_fetch(`${PACKAGED_CONFIG.assets_url}${request_url}`, init)
  }

  return node_fetch(url, init)
}

// Currently copied from @fab/server. In the future, if the caching layer becomes
// configurable for a deploy (e.g. ElastiCache), then this should be moved to a
// @fab/cache-node-inmemory package alongside a @fab/cache-aws-elasticache one.

class Cache {
  constructor() {
    this.cache = new NodeCache()
  }
  async set(key, value, ttl_seconds) {
    // if (value.hasOwnProperty(Symbol.asyncIterator)) {
    // todo: read the stream to completion then store it
    // }
    this.cache.set(key, value, ttl_seconds || 0 /* unlimited */)
  }
  async setJSON(key, value, ttl_seconds) {
    await this.set(key, JSON.stringify(value), ttl_seconds)
  }
  async get(key) {
    return this.cache.get(key)
  }
  async getJSON(key) {
    const val = await this.get(key)
    return val && JSON.parse(val)
  }
  async getArrayBuffer(key) {
    return this.cache.get(key)
  }
  async getNumber(key) {
    return this.cache.get(key)
  }
  async getStream(key) {
    // todo: create a new stream from the stored object to stream it out
    return this.cache.get(key)
  }
}

global.fetch = enhanced_fetch
global.Request = node_fetch.Request
global.Response = node_fetch.Response
global.Headers = node_fetch.Headers
global.URL = URL

const transformHeadersToFetch = (headers) => {
  const fetch_headers = new Headers()
  for (const header_name in headers) {
    for (const header_info of headers[header_name]) {
      fetch_headers.append(header_name, header_info.value)
    }
  }
  return fetch_headers
}

const transformBodyToFetch = (body) => {
  if (body) {
    if (body.encoding === 'base64') {
      return Buffer.from(body.data, body.encoding)
    } else {
      console.log('UNKNOWN ENCODING: ', body.encoding)
    }
  }
  return null
}

const excludedHeaders = new Set([
  'cache-control',
  'content-encoding',
  'content-length',
  'connection',
  'expect',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
  'x-accel-buffering',
  'x-accel-charset',
  'x-accel-limit-rate',
  'x-accel-redirect',
  'x-cache',
  'x-forwarded-proto',
  'x-real-ip',
])
const excludedHeaderPrefixes = [/^x-amz-/i, /^x-amzn-/i, /^x-edge-/i]
const transformHeadersFromFetch = (headers) => {
  const lambda_headers = {}
  for (let [header, value] of headers.entries()) {
    if (excludedHeaders.has(header.toLowerCase())) continue
    if (excludedHeaderPrefixes.some((prefix) => prefix.exec(header))) continue
    lambda_headers[header.toLowerCase()] = [{ header, value }]
  }
  return lambda_headers
}

const text_type = /^text/i
const transformResponseBody = async (response) => {
  const content_type = response.headers.get('content-type')
  if (content_type && text_type.exec(content_type)) {
    const body = await response.text()
    return { body, bodyEncoding: 'text' }
  } else {
    const bytes = await response.arrayBuffer()
    const body = Buffer.from(bytes).toString('base64')
    return { body, bodyEncoding: 'base64' }
  }
}

const handleRequest = async (fab_request, cf_request) => {
  if (fab_request.url.startsWith('http')) {
    cf_request.headers = cf_request.headers || {}
    fab_request.headers.forEach((value, key) => {
      cf_request.headers[key] = { value }
    })
    const url = new URL(fab_request.url)
    cf_request.origin = {
      custom: {
        domainName: url.hostname,
        keepaliveTimeout: 5,
        path: '',
        port: url.port || url.protocol === 'https' ? 443 : 80,
        protocol: url.protocol,
        readTimeout: 30,
        sslProtocols: ['TLSv1.1', 'TLSv1.2'],
      },
    }
    cf_request.querystring = url.search
    cf_request.uri = url.pathname
    console.log({ cf_request })
    return cf_request
  } else if (fab_request.url.startsWith('/_assets')) {
    cf_request.origin = {
      custom: {
        domainName: PACKAGED_CONFIG.assets_domain,
        keepaliveTimeout: 5,
        path: '',
        port: 443,
        protocol: 'https',
        readTimeout: 30,
        sslProtocols: ['TLSv1.1', 'TLSv1.2'],
      },
    }
    cf_request.querystring = ''
    cf_request.uri = PACKAGED_CONFIG.assets_path_prefix + fab_request.url
    cf_request.headers['host'] = [{ key: 'host', value: PACKAGED_CONFIG.assets_domain }]
    console.log({ cf_request })
    return cf_request
  } else {
    throw new Error('FABs do not support relative urls other than /_assets')
  }
}

const handleResponse = async (fetch_response) => {
  const { body: res_body, bodyEncoding } = await transformResponseBody(fetch_response)
  return {
    status: '' + fetch_response.status,
    statusDescription: fetch_response.statusText,
    body: res_body,
    bodyEncoding,
    headers: transformHeadersFromFetch(fetch_response.headers),
  }
}

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  const cf_request = event.Records[0].cf.request
  const host = cf_request.headers.host[0].value
  const method = cf_request.method
  const url = `https://${host}${cf_request.uri}`
  const headers = transformHeadersToFetch(cf_request.headers)
  const body = transformBodyToFetch(cf_request.body)
  console.log({ url, method, headers, body })
  const options =
    body && method.toUpperCase() === 'GET'
      ? { method, headers }
      : { method, headers, body }
  const fetch_request = new global.Request(url, options)

  const fetch_result = await fab.render(fetch_request, settings)
  if (fetch_result instanceof global.Request) {
    return await handleRequest(fetch_result, cf_request)
  } else if (fetch_result instanceof global.Response) {
    return await handleResponse(fetch_result)
  } else {
    throw new Error('Invalid response from FAB')
  }
}
