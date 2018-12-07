/*
* FAB Wrapper
*
* Entry point for the FAB Webpack build
* Maps the simplified index.fab.js to the FAB spec
*
* */

const render_app = require('app-index').default
const rewrites = FAB_REWRITES

console.log(rewrites)

const render = async (req, settings) => {
  return await render_app(req, settings)
}

module.exports = { render }
