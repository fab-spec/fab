/*
* FAB Wrapper
*
* Entry point for the FAB Webpack build
* Maps the simplified index.fab.js to the FAB spec
*
* */

const render_app = require('app-index').default

const render = async (req, settings) => {
  settings.random = Math.random()
  const response = await render_app(req, {}, settings)

  return new Response(response, {
    status: 200,
  })
}

module.exports = { render }
