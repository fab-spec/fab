import * as fs from 'fs-extra'
import * as path from 'path'
import * as webpack from 'webpack'
import * as util from 'util'
// @ts-ignore
import * as _zip from 'deterministic-zip'
const zip = util.promisify(_zip)

export default class Builder {
  static async start(directory: string) {
    console.log(`Building in ${directory}`)

    const assets_path = path.join(directory, 'build', 'assets.json')
    const assets_str = await fs.readFile(assets_path, 'utf8')
    if (!assets_str)
      throw new Error(
        `Missing asset manifest in ${assets_path}. The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

    await new Promise((resolve, reject) =>
      webpack(
        {
          mode: 'production',
          target: 'webworker',
          entry: path.resolve(__dirname, 'fab-wrapper.js'),
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
            path: path.resolve(directory, 'fab/server'),
            filename: 'bundle.js',
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

    await fs.copy(path.resolve(directory, 'build/public'), path.resolve(directory, 'fab/_assets'))

    const zipfile = path.resolve(directory, 'fab/fab.zip')
    const options = {
      includes: ['./server/**', './_assets/**'],
      cwd: path.resolve(directory, 'fab'),
    }
    await zip(path.resolve(directory, 'fab'), zipfile, options)
  }
}
