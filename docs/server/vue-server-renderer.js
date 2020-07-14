import render from '../node_modules/vue-server-renderer/basic'

console.log({ render })

const fake_renderer = {
  renderToString: render,
  renderToStream: render,
}
export default {
  createRenderer: () => fake_renderer,
  createBundleRenderer: () => fake_renderer,
}
