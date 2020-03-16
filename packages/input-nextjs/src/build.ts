import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { FabBuildStep } from '@fab/core'
import path from 'path'
import { InvalidConfigError, _log } from '@fab/cli'
import { preflightChecks } from './preflightChecks'
import globby from 'globby'
import fs from 'fs-extra'
import generateRenderer from './generateRenderer'
import webpack from 'webpack'

const log = _log(`[💚@fab/input-nextjs💚] `)

// @ts-ignore
import md5dir from 'md5-dir/promise'

const RENDERER = `generated-nextjs-renderers`
const WEBPACKED = `webpacked-nextjs-renderers`

export const build: FabBuildStep<InputNextJSArgs, InputNextJSMetadata> = async (
  args,
  proto_fab,
  config_path
) => {
  // const { dir } = args
  if (proto_fab.files!.size > 0) {
    throw new InvalidConfigError(
      `@fab/input-nextjs must be the first 'input' plugin in the chain.`
    )
  }

  const config_dir = path.dirname(path.resolve(config_path))
  const { next_dir_name, next_dir, asset_prefix } = await preflightChecks(config_dir)
  console.log({ next_dir_name, next_dir, asset_prefix })

  log(`I am Input NextJS! Reading files from ${next_dir}`)
  const pages_dir = path.join(next_dir, 'serverless', 'pages')
  const static_dir = path.join(next_dir, 'static')
  const public_dir = path.resolve(next_dir, '../public')
  const pages_dir_hash = await md5dir(pages_dir)
  console.log({ pages_dir, pages_dir_hash })

  log(`Finding all static HTML pages`)
  const html_files = await globby([`**/*.html`, `!_*`], { cwd: pages_dir })

  await Promise.all(
    html_files.map(async (filename) => {
      proto_fab.files!.set(
        '/' + filename,
        await fs.readFile(path.join(pages_dir, filename))
      )
    })
  )

  log(`Found 💛${html_files.length} static html pages💛.`)

  const cache_dir = path.join(config_dir, '.fab', '.cache')
  const render_code_file = path.join(
    cache_dir,
    `${RENDERER}.${pages_dir_hash.slice(0, 7)}.js`
  )

  const render_code_src = await getRenderCode(render_code_file, pages_dir, cache_dir)
  // todo: hash render_code

  // TEMPORARY: webpack this file to inject all the required shims
  const webpacked_output = path.join(cache_dir, `${WEBPACKED}.js`)
  console.log({ webpacked_output })

  const shims_dir = path.join(__dirname, 'shims')

  const entry_point = `
    const renderers = require('${render_code_file}')
    const MockExpressResponse = require('${path.join(
      shims_dir,
      'mock-express-response'
    )}')
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
          },
        },
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

  proto_fab.hypotheticals[`${RENDERER}.js`] = await fs.readFile(webpacked_output, 'utf8')

  log(`Finding all static assets`)
  const asset_files = await globby([`**/*`], { cwd: static_dir })
  if (asset_files.length > 0) {
    for (const asset_file of asset_files) {
      proto_fab.files.set(
        `/_next/static/${asset_file}`,
        await fs.readFile(path.resolve(static_dir, asset_file))
      )
      log(`  💛${asset_file}💛 read.`)
    }
  }

  log(`Finding all public files`)
  const public_files = await globby([`**/*`], { cwd: public_dir })
  if (public_files.length > 0) {
    for (const public_file of public_files) {
      proto_fab.files.set(
        `/${public_file}`,
        await fs.readFile(path.resolve(public_dir, public_file))
      )
      log(`  💛${public_file}💛 read.`)
    }
  }
}

async function getRenderCode(
  renderer_cache: string,
  pages_dir: string,
  cache_dir: string
) {
  if (await fs.pathExists(renderer_cache)) {
    log(
      `Reusing NextJS renderer cache 💛${path.relative(process.cwd(), renderer_cache)}💛`
    )
    return await fs.readFile(renderer_cache, 'utf8')
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
  await fs.writeFile(renderer_cache, render_code)
  return render_code
}
