/*

Noop renderer for a FAB.

Just generates 404 NOT FOUND responses for all requests.

*/

const render = async (req, settings) => {
  return new Response(null, {
    status: 404,
    statusText:'Not Found',
    headers: {}
  })
}

module.exports = { render }
