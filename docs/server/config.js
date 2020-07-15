const webpack = require('webpack')
const path = require('path')

console.log('WAIT WE WORKIN?')

module.exports = {
  alias: (alias) => {
    const empty_object = require.resolve('@fab/plugin-precompile/shims/empty-object')
    return {
      ...alias,
      //'vue-server-renderer': path.join(__dirname, './vue-server-renderer'),
      net: empty_object,
      fsevents: empty_object,
      [require.resolve('@nuxt/content/lib/database')]: empty_object,
      [require.resolve('@nuxt/content/lib/ws')]: empty_object,
    }
  },
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FAB_BUILD': true,
      })
    )
    config.stats = 'verbose'
    return config
  },
}
