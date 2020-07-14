import x from './load-pages'
import nuxt_server from '../.nuxt/dist/server/server.js'
import vue_renderer from './nuxt-vue-renderer'

export default ({ Router }) => {
  console.log({ vue_renderer })
  console.log({ x })

  Router.on('*', async ({ url }) => {
    const route = await nuxt_server({
      url: url.pathname,
      runtimeConfig: {},
    })
    //console.log({ route })
    const body = await vue_renderer(route)
    console.log({ body })
    //console.log(server.context.app.router)
    //console.log(server.context.app.render.toString())

    return new Response(body, {
      headers: {
        'content-type': 'text/html',
      },
    })
  })
}
