import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as util from 'util'
import * as globby from 'globby'
import * as path from 'path'
// @ts-ignore
import * as _zip from 'deterministic-zip'
import * as webpack from 'webpack'
import * as hasha from 'hasha'

const zip = util.promisify(_zip)

const _log = (str: string) =>
  `${chalk.gray(`[FAB:Compile]`)} ${str.split(/\n\s*/).join('\n              ')}`
const log = (str: string) => console.log(_log(str))
const error = (str: string) => console.log(_log(chalk.red(str)))

type CompilerOpts = {
  post_webpack_side_effect?: () => Promise<void>
  compile_only?: boolean
  module_loaders?: Array<Object>
  resolve_loader_modules?: Array<string>
  resolve_aliases?: { [name: string]: string }
}
export default class Compiler {
  static async compile(
    input_dir: string,
    build_dir: string,
    output_file: string,
    opts: CompilerOpts = {}
  ) {
    const input_path = path.resolve(input_dir)
    const build_path = path.resolve(build_dir)

    if (opts.compile_only) {
      console.log(`--compile-only set. Skipping build.`)
    } else {
      await this.build(input_path, build_path, input_dir, build_dir, opts)
    }

    await this.zip(build_dir, output_file)
  }

  private static async build(
    input_path: string,
    build_path: string,
    input_dir: string,
    build_dir: string,
    opts: CompilerOpts
  ) {
    if (!(await fs.pathExists(input_path))) {
      error(`${input_path} doesn't exist!`)
      throw new Error('Missing directory')
    }
    log(`Compiling ${chalk.green(input_path)}`)

    await fs.emptyDir(build_path)

    const assets_path = path.join(input_path, '_assets')
    if (!(await fs.pathExists(assets_path))) {
      log(`${chalk.yellow(`No _assets directory detected.`)}
          This isn't necessarily a problem, but your FAB may be able to be optimised.
          For more info, visit https://fab.dev/eh?no-assets-dir`)
    } else {
      log(`Copying fingerprinted _assets:`)
      await fs.copy(assets_path, path.join(build_path, '_assets'), {
        filter(src, dest) {
          if (src.match(/\.\w+$/))
            log(
              `    ${chalk.gray(input_dir + '/')}${chalk.yellow(
                path.relative(input_path, src)
              )} => ${chalk.gray(build_dir + '/')}${chalk.yellow(path.relative(build_path, dest))}`
            )
          return true
        }
      })
      log(`Done!`)
    }

    log(`Copying non-fingerprinted (public) assets:`)
    const paths = await globby(['**/*', '!_server/**/*', '!_assets/**/*'], {
      cwd: input_path
    })
    const renames: { [filename: string]: string } = {}
    if (paths.length > 0) {
      await Promise.all(
        paths.map(async filename => {
          try {
            const stats = await fs.stat(path.join(input_path, filename))
            if (stats.isDirectory()) return

            const full_hash = await hasha.fromFile(path.join(input_path, filename), {
              algorithm: 'md5'
            })
            const hash = full_hash!.substring(0, 9)
            const asset_path = `_assets/_public/${filename.replace(/([^.]*)$/, `${hash}.$1`)}`
            renames['/' + filename] = '/' + asset_path
            log(
              `    ${chalk.gray(input_dir + '/')}${chalk.yellow(filename)} => ${chalk.gray(
                build_dir + '/'
              )}${chalk.yellow(asset_path)}`
            )
            await fs.copy(path.join(input_path, filename), path.join(build_path, asset_path))
          } catch (e) {
            error(`Error copying ${filename}: ${e}`)
            throw e
          }
        })
      )
      log(`Done!`)
    } else {
      log(`No non-fingerprinted assets found.`)
    }

    const server_path = path.join(input_path, '_server', 'index.js')
    const settings_path = path.join(input_path, '_server', 'production-settings.json')
    if (!(await fs.pathExists(server_path))) {
      log(`${chalk.yellow(`No _server/index.js file detected.`)}
          Your FAB will only have the simplest of webservers injected.
          If you want to host a static site, you probably want @fab/static
          https://fab.dev/eh?no-server-index`)
      await this.webpack(
        path.resolve(__dirname, 'files/fallback-index.js'),
        settings_path,
        build_path,
        renames,
        opts
      )
    } else {
      log(`Injecting FAB wrapper and compiling ${chalk.green(server_path)}`)
      await this.webpack(server_path, settings_path, build_path, renames, opts)
    }

    const bundle_output = path.join(build_path, 'server.js')
    const stats1 = await fs.stat(bundle_output)
    log(
      `    ${path.relative(process.cwd(), bundle_output)} (${chalk.green(
        Math.round(stats1.size / 1024) + 'KB'
      )})`
    )
    log(`Done!`)

    if (opts.post_webpack_side_effect) {
      await opts.post_webpack_side_effect()
    }
  }

  private static async zip(build_dir: string, output_file: string) {
    log(`Zipping it up into a FAB`)

    const zipfile = path.resolve(output_file)
    const options = {
      includes: ['./server.js', './_assets/**'],
      cwd: build_dir
    }
    await zip(build_dir, zipfile, options)
    const stats2 = await fs.stat(zipfile)
    log(
      `    ${path.relative(process.cwd(), zipfile)} (${chalk.green(
        Math.round(stats2.size / 1024) + 'KB'
      )})`
    )

    log(chalk.green(`All done!`))
  }

  private static async webpack(
    server_path: string,
    settings_path: string,
    build_path: string,
    renames: { [p: string]: string },
    opts: CompilerOpts
  ) {
    const settings_exists = await fs.pathExists(settings_path)
    if (settings_exists) {
      log(
        `    Found production settings file at ${chalk.yellow(
          path.relative(process.cwd(), settings_path)
        )}`
      )
    }
    await new Promise((resolve, reject) =>
      webpack(
        {
          mode: 'production',
          target: 'webworker',
          entry: path.resolve(__dirname, 'files/fab-entry.js'),
          optimization: {
            minimize: true
          },
          resolve: {
            alias: {
              path: 'path-browserify',
              'app-index': server_path,
              'production-settings.json': settings_exists
                ? settings_path
                : path.resolve(__dirname, 'files/default-production-settings.json'),
              ...(opts.resolve_aliases || {})
            }
          },
          resolveLoader: {
            modules: [
              'node_modules',
              'node_modules/@fab/compile/node_modules',
              ...(opts.resolve_loader_modules || [])
            ]
          },
          module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: '@sucrase/webpack-loader',
                  options: {
                    transforms: ['typescript','imports']
                  }
                }
              },
              ...(opts.module_loaders || [])
            ]
          },
          output: {
            path: build_path,
            filename: 'server.js',
            library: 'server',
            libraryTarget: 'commonjs2'
          },
          node: {
            path: true,
            process: true,
            net: 'empty'
          },
          plugins: [
            new webpack.DefinePlugin({
              FAB_REWRITES: JSON.stringify(renames)
            })
          ]
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
