/*
* FAB Wrapper
*
* Entry point for the FAB Webpack build
* Maps the simplified index.fab.js to the FAB spec
*
* */

const url = require('url')
const render_app = require('app-index').render
const rewrites = FAB_REWRITES

const render = async (req, settings) => {
  const parsed = url.parse(req.url)
  const rewrite = rewrites[parsed.path]
  if (rewrite) {
    const response = await fetch(`${parsed.protocol}//${parsed.host}${rewrite}`)
    response.headers.delete('cache-control')
    return response
  }
  return await render_app(req, settings)
}

module.exports = { render }
