import { FabBuildStep, ProtoFab } from '@fab/core'
import { NodeCompatArgs, NodeCompatMetadata } from './types'
import { _log } from '@fab/cli'
import webpack from 'webpack'
import fs from 'fs-extra'
import path from 'path'
import filenamify from 'filenamify'

const log = _log('@fab/plugin-node-compat')

export const build: FabBuildStep<NodeCompatArgs, NodeCompatMetadata> = async (
  args: NodeCompatArgs,
  proto_fab: ProtoFab<NodeCompatMetadata>,
  config_path,
  skip_cache = false
) => {
  /*
   * TODO
   *
   * Port the @fab/input-nextjs stuff across, shimming out pieces as needed.
   * Make each file a new "runtime", that's compiled using webpack, with a bunch
   * of good defaults but the args for each section are all the overrides.
   *
   * */
  const config_dir = path.dirname(path.resolve(config_path))
  const cache_dir = path.join(config_dir, '.fab', '.cache', 'node-compat')
  await fs.ensureDir(cache_dir)

  const output_files: string[] = []

  for (const [file, config] of Object.entries(args)) {
    const webpacked_output = path.join(
      cache_dir,
      `${filenamify(file, { replacement: '-' })}.js`
    )
    const entry = path.resolve(file)
    await new Promise((resolve, reject) =>
      webpack(
        {
          stats: 'verbose',
          mode: 'production',
          target: 'webworker',
          entry,
          optimization: {
            minimize: false,
          },
          output: {
            path: path.dirname(webpacked_output),
            filename: path.basename(webpacked_output),
            library: 'server',
            libraryTarget: 'commonjs2',
          },
          resolve: {
            alias: {
              fs: require.resolve('memfs'),
              // path: path.join(shims_dir, 'path-with-posix'),
              // '@ampproject/toolbox-optimizer': path.join(shims_dir, 'empty-object'),
              // http: path.join(shims_dir, 'http'),
              // https: path.join(shims_dir, 'empty-object'),
            },
          },
          node: {
            global: false,
          },
          plugins: [
            /* Cloudflare Workers will explode if it even _sees_ `eval` in a file,
             * even if it's never called. Replacing it with this will bypasses that.
             * (It'll still explode if it's called, nothing we can do about that.) */
            new webpack.DefinePlugin({
              eval: 'HERE_NO_EVAL',
            }),
          ],
        },
        (err, stats) => {
          if (err || stats.hasErrors()) {
            console.log('Build failed.')
            console.log(err)
            console.log(stats && stats.toJson().errors.toString())
            reject()
          }
          resolve()
        }
      )
    )
    output_files.push(webpacked_output)
  }

  return output_files
}
