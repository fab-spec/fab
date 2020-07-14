import vue_renderer from '../node_modules/vue-server-renderer/basic'

export default async function renderRoute(route) {
  return await new Promise((yeah, nah) =>
    vue_renderer(route, (err, cb) => (err ? nah(err) : yeah(cb)))
  )
}
