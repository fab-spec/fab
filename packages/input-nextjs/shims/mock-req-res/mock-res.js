// Mocks http.ServerResponse

module.exports = MockServerResponse

var Transform = require('stream').Transform,
  util = require('util'),
  STATUS_CODES = require('http').STATUS_CODES

function MockServerResponse(finish) {
  Transform.call(this)

  this.statusCode = 200
  this.statusMessage = STATUS_CODES[this.statusCode]

  this._header = this._headers = {}
  if (typeof finish === 'function') this.on('finish', finish)

  this._responseData = []

  this.finished = false
}

util.inherits(MockServerResponse, Transform)

MockServerResponse.prototype._transform = function(chunk, encoding, next) {
  this.push(chunk)
  this._responseData.push(chunk)
  next()
}

MockServerResponse.prototype.setHeader = function(name, value) {
  this._headers[name.toLowerCase()] = value
}

MockServerResponse.prototype.getHeader = function(name) {
  return this._headers[name.toLowerCase()]
}

MockServerResponse.prototype.getHeaders = function() {
  return this._headers
}

MockServerResponse.prototype.removeHeader = function(name) {
  delete this._headers[name.toLowerCase()]
}

MockServerResponse.prototype.writeHead = function(statusCode, reason, headers) {
  if (arguments.length == 2 && typeof arguments[1] !== 'string') {
    headers = reason
    reason = undefined
  }
  this.statusCode = statusCode
  this.statusMessage = reason || STATUS_CODES[statusCode] || 'unknown'
  if (headers) {
    for (var name in headers) {
      this.setHeader(name, headers[name])
    }
  }
}

MockServerResponse.prototype._getString = function() {
  return Buffer.concat(this._responseData).toString()
}

MockServerResponse.prototype._getJSON = function() {
  return JSON.parse(this._getString())
}

MockServerResponse.prototype.end = function() {
  Transform.prototype.end.apply(this, arguments)
  this.finished = true
}

/* Not implemented:
MockServerResponse.prototype.writeContinue()
MockServerResponse.prototype.setTimeout(msecs, callback)
MockServerResponse.prototype.headersSent
MockServerResponse.prototype.sendDate
MockServerResponse.prototype.addTrailers(headers)
*/
