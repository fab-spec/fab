import * as fs from 'fs-extra'
import * as path from 'path'
import * as webpack from 'webpack'
import * as util from 'util'
// @ts-ignore
import * as _zip from 'deterministic-zip'
const zip = util.promisify(_zip)

export default class Builder {
  static async start(dir: string, output_dir: string) {
    console.log(`Building in ${dir}`)

    const assets_path = path.join(dir, 'build', 'assets.json')
    const assets_str = await fs.readFile(assets_path, 'utf8')
    if (!assets_str)
      throw new Error(
        `Missing asset manifest in ${assets_path}. The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

    // Can this just move (without compiling) files into place and let 'fab compile'
    // do the actual webpacking?

    await new Promise((resolve, reject) =>
      webpack(
        {
          mode: 'production',
          target: 'webworker',
          entry: path.resolve(__dirname, 'files/fab-wrapper.js'),
          optimization: {
            minimize: false
          },
          resolve: {
            alias: {
              fs: 'memfs',
              'app-index': path.resolve(dir, 'build/server.js'),
            }
          },
          output: {
            path: path.resolve(output_dir, 'server'),
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

    await fs.copy(path.resolve(dir, 'build/public'), path.resolve(output_dir, '_assets'))

    const zipfile = path.resolve(output_dir, 'fab.zip')
    const options = {
      includes: ['./server/**', './_assets/**'],
      cwd: output_dir,
    }
    await zip(output_dir, zipfile, options)
  }
}
