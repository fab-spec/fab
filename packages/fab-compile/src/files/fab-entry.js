/*
 * FAB Wrapper
 *
 * Entry point for the FAB Webpack build
 * Maps the simplified index.fab.js to the FAB spec
 *
 * */

import { fetchAndReturn } from '../utils'

import url from 'url'
import { render as render_app } from 'app-index'
import production_settings from 'production-settings.json'

const rewrites = FAB_REWRITES

export async function render(req, settings) {
  const parsed = url.parse(req.url)
  const { pathname, protocol, host } = parsed

  const rewrite = rewrites[pathname]
  if (rewrite) {
    //return await fetchAndReturn(`${protocol}//${host}${rewrite}`)
    return new Response(null, {
      status: 302,
      statusText: 'Found',
      headers: {
        Location: `${protocol}//${host}${rewrite}`
      }
    })
  }
  return await render_app(req, settings)
}

export function getProdSettings() {
  return production_settings
}
