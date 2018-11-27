import * as fs from 'async-file'
import * as path from 'path'
import * as webpack from 'webpack'

export default class Builder {
  static async start(directory: string) {
    console.log(`Building in ${directory}`)

    const assets_path = path.join(directory, 'build', 'assets.json')
    const assets_str = await fs.readFile(assets_path, 'utf8')
    if (!assets_str)
      throw new Error(
        `Missing asset manifest in ${assets_path}. The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

    return await new Promise((resolve, reject) =>
      webpack(
        {
          mode: 'production',
          target: 'webworker',
          entry: path.resolve(__dirname, 'wrapper/index.js'),
          optimization: {
            minimize: false
          },
          resolve: {
            alias: {
              fs: 'memfs',
              'app-index': path.resolve(directory, 'build/server.js'),
            }
          },
          output: {
            path: path.resolve(directory, 'fab'),
            filename: 'runtime.js',
            library: 'server',
            libraryTarget: 'commonjs2'
          },
          node: {
            path: true,
            process: true,
            net: 'empty'
          }
        },
        (err, stats) => {
          if (err || stats.hasErrors()) {
            console.log('Build failed.')
            console.log(err)
            console.log(stats.toJson().errors.toString())
            reject()
          }
          resolve()
        }
      )
    )
  }
}
