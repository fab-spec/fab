import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { FabBuildStep } from '@fab/core'
import path from 'path'
import { InvalidConfigError, _log } from '@fab/cli'
import { preflightChecks } from './preflightChecks'
import globby from 'globby'
import fs from 'fs-extra'
import generateRenderer from './generateRenderer'
import webpack from 'webpack'

const log = _log(`@fab/input-nextjs`)

// @ts-ignore
import md5dir from 'md5-dir/promise'

const RENDERER = `generated-nextjs-renderers`
const WEBPACKED = `webpacked-nextjs-renderers`

export const build: FabBuildStep<InputNextJSArgs, InputNextJSMetadata> = async (
  args,
  proto_fab,
  config_path,
  skip_cache = false
) => {
  // const { dir } = args
  if (proto_fab.files!.size > 0) {
    throw new InvalidConfigError(
      `@fab/input-nextjs must be the first 'input' plugin in the chain.`
    )
  }

  const config_dir = path.dirname(path.resolve(config_path))
  const { next_dir_name, next_dir, asset_prefix } = await preflightChecks(config_dir)
  // console.log({ next_dir_name, next_dir, asset_prefix })

  log(`Reading files from 💛${next_dir}💛`)
  const pages_dir = path.join(next_dir, 'serverless', 'pages')
  const static_dir = path.join(next_dir, 'static')
  const public_dir = path.resolve(next_dir, '../public')
  const pages_dir_hash = await md5dir(pages_dir)
  // console.log({ pages_dir, pages_dir_hash })

  log(`Finding all static HTML pages...`)
  const html_files = await globby([`**/*.html`, `!_*`], { cwd: pages_dir })

  await Promise.all(
    html_files.map(async (filename) => {
      proto_fab.files!.set(
        '/' + filename,
        await fs.readFile(path.join(pages_dir, filename))
      )
    })
  )

  log.tick(`Found 💛${html_files.length} static html pages💛.`)

  const cache_dir = path.join(config_dir, '.fab', '.cache')
  const renderer_path = path.join(
    cache_dir,
    `${RENDERER}.${pages_dir_hash.slice(0, 7)}.js`
  )

  const render_code_src = await getRenderCode(
    renderer_path,
    pages_dir,
    cache_dir,
    skip_cache
  )
  // todo: hash & cache render_code

  // Webpack this file to inject all the required shims, before rolling it up,
  // since Webpack is way better at that job. Potentially this logic should be
  // moved out into a separate module or into the core compiler.
  const webpacked_output = path.join(cache_dir, `${WEBPACKED}.js`)

  const shims_dir = path.resolve(__dirname, '../shims')

  const mock_express_response_path = path.join(shims_dir, 'mock-express-response')
  const entry_point = `
    const renderers = require(${JSON.stringify(renderer_path)});
    const MockExpressResponse = require(${JSON.stringify(mock_express_response_path)});

    module.exports = { renderers, MockExpressResponse }
  `
  const entry_file = path.join(cache_dir, 'entry-point.js')
  await fs.writeFile(entry_file, entry_point)

  await new Promise((resolve, reject) =>
    webpack(
      {
        stats: 'verbose',
        mode: 'production',
        target: 'webworker',
        entry: entry_file,
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
            path: path.join(shims_dir, 'path-with-posix'),
            '@ampproject/toolbox-optimizer': path.join(shims_dir, 'empty-object'),
            http: path.join(shims_dir, 'http'),
            https: path.join(shims_dir, 'empty-object'),
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

  const webpacked_src = await fs.readFile(webpacked_output, 'utf8')
  proto_fab.hypotheticals[`${RENDERER}.js`] = webpacked_src

  log(`Finding all static assets`)
  const asset_files = await globby([`**/*`], { cwd: static_dir })
  if (asset_files.length > 0) {
    for (const asset_file of asset_files) {
      proto_fab.files.set(
        `/_next/static/${asset_file}`,
        await fs.readFile(path.resolve(static_dir, asset_file))
      )
    }
  }
  log.tick(`Found ${asset_files.length} assets.`)

  log(`Finding all public files`)
  const public_files = await globby([`**/*`], { cwd: public_dir })
  if (public_files.length > 0) {
    for (const public_file of public_files) {
      proto_fab.files.set(
        `/${public_file}`,
        await fs.readFile(path.resolve(public_dir, public_file))
      )
      log.tick(`🖤${public_file}🖤`, 2)
    }
  }
}

async function getRenderCode(
  renderer_path: string,
  pages_dir: string,
  cache_dir: string,
  skip_cache: boolean
) {
  /* Renderer path is fingerprinted with hash of the contents, so if it exists,
   * we can reuse it unless we want to --skip-cache*/
  if (await fs.pathExists(renderer_path)) {
    const relative_path = path.relative(process.cwd(), renderer_path)
    if (skip_cache) {
      log.note(`Skipping cached renderer, regenerating 💛${relative_path}💛`)
    } else {
      log(`Reusing NextJS renderer cache 💛${relative_path}💛`)
      return await fs.readFile(renderer_path, 'utf8')
    }
  }

  log(`Finding all dynamic NextJS entry points`)
  const js_renderers = await globby([`**/*.js`], { cwd: pages_dir })
  const render_code = await generateRenderer(js_renderers, pages_dir)

  log(`Found 💛${js_renderers.length} dynamic pages💛.`)

  // Write out the cache while cleaning out any old caches
  await fs.ensureDir(cache_dir)
  const previous_caches = await globby([`${RENDERER}.*.js`], { cwd: cache_dir })
  await Promise.all(
    previous_caches.map((cache) => fs.remove(path.join(cache_dir, cache)))
  )
  await fs.writeFile(renderer_path, render_code)
  log.tick(`Wrote 💛${renderer_path}💛`)
  return render_code
}
