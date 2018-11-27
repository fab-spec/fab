const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    bundle: [path.resolve(__dirname, 'build/server.js')]
  },
  target: 'webworker',
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')],
    alias: {
      fs: 'memfs',
      initFiles: path.resolve(__dirname, 'build/_includes.js')
    }
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'node_modules')]
  },
  optimization: {
    minimize: false
  },
  output: {
    path: path.resolve(__dirname, 'fab'),
    filename: '[name].js',
    library: 'server',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { BUNDLE: '"true"' } })
  ],
  node: {
    path: true,
    process: true
  }
}
