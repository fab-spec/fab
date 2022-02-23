const webpack = require('webpack')

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        replace_me: '"WITH_ME"',
      })
    )
    return config
  },
  alias: (alias) => ({
    ...alias,
    'no-existo': require.resolve('@dev-spendesk/plugin-precompile/shims/empty-object'),
  }),
}
