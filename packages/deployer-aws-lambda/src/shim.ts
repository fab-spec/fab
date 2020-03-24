// language=JavaScript
export default (envSettings: any) => `
'use strict'
const URL = require('url').URL
const fetch = require('node-fetch')
const fab = require('./server')

const prodSettings = fab.getProdSettings ? fab.getProdSettings() : {}
const envSettings = ${JSON.stringify(envSettings)}
const settings = Object.assign({}, prodSettings, envSettings)

//Need to set this to work around a bug in a dependency of the webpack http(s) shim
global.location = { protocol: 'https:' }

global.fetch = fetch
global.Request = fetch.Request
global.Response = fetch.Response
global.Headers = fetch.Headers
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

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  const cf_request = event.Records[0].cf.request
  const host = cf_request.headers.host[0].value
  const method = cf_request.method
  const url = \`https://\${host}\${cf_request.uri}\`
  const headers = transformHeadersToFetch(cf_request.headers)
  const body = transformBodyToFetch(cf_request.body)
  console.log({ url, method, headers, body })
  const options =
    body && method.toUpperCase() === 'GET' ? { method, headers } : { method, headers, body }
  const fetch_request = new global.Request(url, options)

  const fetch_response = await fab.render(fetch_request, settings)
  const { body: res_body, bodyEncoding } = await transformResponseBody(fetch_response)
  const lambda_response = {
    status: '' + fetch_response.status,
    statusDescription: fetch_request.statusText,
    body: res_body,
    bodyEncoding,
    headers: transformHeadersFromFetch(fetch_response.headers),
  }
  console.log({ lambda_response })

  return lambda_response
}

`
