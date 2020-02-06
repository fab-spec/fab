import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { FabBuildStep } from '@fab/core'
import path from 'path'
import { InvalidConfigError, log } from '@fab/cli'
import { preflightChecks } from './preflightChecks'
import globby from 'globby'
import fs from 'fs-extra'
import generateRenderer from './generateRenderer'
import webpack from 'webpack'

// @ts-ignore
import md5dir from 'md5-dir/promise'

const RENDERER = `generated-nextjs-renderers`
const WEBPACKED = `webpacked-nextjs-renderers`

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
  const js_renderers = await globby([`**/*.js`, `!_*`], { cwd: pages_dir })
  const render_code = await generateRenderer(js_renderers, pages_dir)

  // Write out the cache
  await fs.ensureDir(cache_dir)
  const previous_caches = await globby([`${RENDERER}.*.js`], { cwd: cache_dir })
  await Promise.all(
    previous_caches.map((cache) => fs.remove(path.join(cache_dir, cache)))
  )
  await fs.writeFile(renderer_cache, render_code)
  return render_code
}

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
  const pages_dir_hash = await md5dir(pages_dir)
  console.log({ pages_dir, pages_dir_hash })

  log(`Finding all static HTML pages`)
  const html_files = await globby([`**/*.html`, `!_*`], { cwd: pages_dir })

  await Promise.all(
    html_files.map(async (filename) => {
      proto_fab.files!.set(
        '/' + filename,
        await fs.readFile(path.join(pages_dir, filename), 'utf8')
      )
    })
  )

  const cache_dir = path.join(config_dir, '.fab', '.cache')
  const renderer_cache = path.join(
    cache_dir,
    `${RENDERER}.${pages_dir_hash.slice(0, 7)}.js`
  )

  const render_code = await getRenderCode(renderer_cache, pages_dir, cache_dir)

  // TEMPORARY: webpack this file to inject all the required shims
  const webpacked_output = path.join(cache_dir, `${WEBPACKED}.js`)
  await new Promise((resolve, reject) =>
    webpack(
      {
        mode: 'production',
        target: 'webworker',
        entry: renderer_cache,
        optimization: {
          minimize: false,
        },
        output: {
          path: webpacked_output,
          filename: 'server.js',
          library: 'server',
          libraryTarget: 'commonjs2',
        },
        resolve: {
          alias: {
            fs: require.resolve('memfs'),
          },
        },
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

  proto_fab.hypotheticals[`${RENDERER}.js`] = await fs.readFile(webpacked_output, 'utf8')
}
