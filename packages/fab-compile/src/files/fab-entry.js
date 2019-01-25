/*
 * FAB Wrapper
 *
 * Entry point for the FAB Webpack build
 * Maps the simplified index.fab.js to the FAB spec
 *
 * */

const { fetchAndReturn } = require('@fab/compile/utils')

const url = require('url')
const render_app = require('app-index').render
const production_settings = require('production-settings.json')
const rewrites = FAB_REWRITES

const render = async (req, settings) => {
  const parsed = url.parse(req.url)
  const { path, protocol, host } = parsed

  const rewrite = rewrites[path]
  if (rewrite) {
    return await fetchAndReturn(`${protocol}//${host}${rewrite}`)
  }
  return await render_app(req, settings)
}

module.exports = {
  render,
  getProdSettings() {
    return production_settings
  }
}
