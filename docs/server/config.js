const webpack = require('webpack')
const path = require('path')

console.log('WAIT WE WORKIN?')

module.exports = {
  alias: (alias) => {
    return {
      ...alias,
      //'vue-server-renderer': path.join(__dirname, './vue-server-renderer'),
      //'fs-extra': require.resolve('@fab/plugin-precompile/shims/empty-object'),
    }
  },
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FAB_BUILD': true,
      })
    )
    return config
  },
}
