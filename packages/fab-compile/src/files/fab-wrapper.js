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

console.log(rewrites)

const render = async (req, settings) => {
  const { path } = url.parse(req.url)
  if (rewrites[path]) {
    // const response = await fetch()
    return new Response('NAHHHH', {
      status: 404,
      headers: {}
    })
  }
  return await render_app(req, settings)
}

module.exports = { render }
