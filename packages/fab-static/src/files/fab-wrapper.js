/*
* Static FAB Wrapper
*
* Entry point for the Static FAB Webpack build
*
* */

const htmls = require('./htmls')

console.log({htmls})

const render = async (req, settings) => {
  return new Response(null, {
    status: 404,
    statusText:'Not Found',
    headers: {}
  })
}

module.exports = { render }
