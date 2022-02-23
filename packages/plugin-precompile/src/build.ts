import { FabBuildStep, ProtoFab, RuntimePlugin } from '@dev-spendesk/core'
import {
  PrecompileArgs,
  PrecompileMetadata,
  ConfigOverrides,
  PluginOverrides,
} from './types'
import { _log } from '@dev-spendesk/fab-cli'
import webpack from 'webpack'
import fs from 'fs-extra'
import path from 'path'
import filenamify from 'filenamify'

const log = _log('@dev-spendesk/plugin-precompile')

export const build: FabBuildStep<PrecompileArgs, PrecompileMetadata> = async (
  args: PrecompileArgs,
  proto_fab: ProtoFab<PrecompileMetadata>,
  config_path,
  skip_cache = false
) => {
  /*
   * TODO
   *
   * Port the @dev-spendesk/input-nextjs stuff across, shimming out pieces as needed.
   * Make each file a new "runtime", that's compiled using webpack, with a bunch
   * of good defaults but the args for each section are all the overrides.
   *
   * */
  const config_dir = path.dirname(path.resolve(config_path))
  const cache_dir = path.join(config_dir, '.fab', '.cache', 'precompile')
  await fs.ensureDir(cache_dir)

  const output_files: RuntimePlugin[] = []

  for (const [file, config] of Object.entries(args)) {
    const webpacked_output = path.join(
      cache_dir,
      `${filenamify(file, { replacement: '-' })}.js`
    )
    const entry = path.resolve(file)
    const { _config: plugin_config_file, ...plugin_args } = config

    const { customise_aliases, customise_webpack } = await getPluginOverrides(
      config_dir,
      plugin_config_file
    )

    const options: webpack.Configuration = customise_webpack({
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
        alias: customise_aliases({
          fs: require.resolve('memfs'),
          // path: path.join(shims_dir, 'path-with-posix'),
          // '@ampproject/toolbox-optimizer': path.join(shims_dir, 'empty-object'),
          // http: path.join(shims_dir, 'http'),
          // https: path.join(shims_dir, 'empty-object'),
        }),
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)$/,
            use: {
              loader: '@sucrase/webpack-loader',
              options: {
                transforms: ['jsx', 'typescript', 'imports'],
              },
            },
          },
        ],
      },
      node: {
        global: false,
      },
      // @ts-ignore
      plugins: [
        /* Cloudflare Workers will explode if it even _sees_ `eval` in a file,
         * even if it's never called. Replacing it with this will bypasses that.
         * (It'll still explode if it's called, nothing we can do about that.) */
        new webpack.DefinePlugin({
          eval: 'HERE_NO_EVAL',
        }),
      ],
    })

    await new Promise((resolve, reject) =>
      webpack(options, (err, stats) => {
        if (err || stats.hasErrors()) {
          console.log('Build failed.')
          console.log(err)
          console.log(stats && stats.toJson().errors.toString())
          reject()
        }
        resolve()
      })
    )

    output_files.push({
      runtime: webpacked_output,
      plugin_args,
    })
  }

  return output_files
}

async function getPluginOverrides(
  config_dir: string,
  plugin_config_file: string | undefined
): Promise<ConfigOverrides> {
  if (!plugin_config_file) {
    return {
      customise_webpack: (x) => x,
      customise_aliases: (x) => x,
    }
  }

  const plugin_overrides = require(path.resolve(
    config_dir,
    plugin_config_file
  )) as PluginOverrides
  return {
    customise_webpack: plugin_overrides.webpack || ((x) => x),
    customise_aliases: plugin_overrides.alias || ((x) => x),
  }
}
