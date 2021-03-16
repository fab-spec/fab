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
  const shims_dir = path.resolve(__dirname, '../shims')

  const mock_express_response_path = path.join(
    shims_dir,
    'mock-req-res/mock-express-response'
  )
  const mock_req_path = path.join(shims_dir, 'mock-req-res/mock-req')
  const entry_point = `
    const renderers = require(${JSON.stringify(renderer_path)});
    const MockExpressResponse = require(${JSON.stringify(mock_express_response_path)});
    const MockReq = require(${JSON.stringify(mock_req_path)});

    module.exports = { renderers, MockExpressResponse, MockReq }
  `
  const entry_file = path.join(cache_dir, 'entry-point.js')
  await fs.writeFile(entry_file, entry_point)

  // TODO: this
  //         new webpack.DefinePlugin({
  //           eval: 'HERE_NO_EVAL',
  //         }),

  proto_fab.hypotheticals[`${RENDERER}.js`] = entry_point
  const shims: { [name: string]: string } = {
    events: await fs.readFile(
      require.resolve(`rollup-plugin-node-builtins/src/es6/events`),
      'utf8'
    ),
    stream: await fs.readFile(
      require.resolve(`rollup-plugin-node-builtins/src/es6/stream`),
      'utf8'
    ),
    'readable-stream/duplex.js': await fs.readFile(
      require.resolve(`rollup-plugin-node-builtins/src/es6/readable-stream/duplex.js`),
      'utf8'
    ),
    'readable-stream/readable.js': await fs.readFile(
      require.resolve(`rollup-plugin-node-builtins/src/es6/readable-stream/readable.js`),
      'utf8'
    ),
    'readable-stream/writable.js': await fs.readFile(
      require.resolve(`rollup-plugin-node-builtins/src/es6/readable-stream/writable.js`),
      'utf8'
    ),
    'readable-stream/transform.js': await fs.readFile(
      require.resolve(`rollup-plugin-node-builtins/src/es6/readable-stream/transform.js`),
      'utf8'
    ),
    'readable-stream/passthrough.js': await fs.readFile(
      require.resolve(
        `rollup-plugin-node-builtins/src/es6/readable-stream/passthrough.js`
      ),
      'utf8'
    ),
    'readable-stream/buffer-list.js': await fs.readFile(
      require.resolve(
        `rollup-plugin-node-builtins/src/es6/readable-stream/buffer-list.js`
      ),
      'utf8'
    ),
    buffer: await fs.readFile(path.join(shims_dir, 'buffer.js'), 'utf8'),
    isArray: await fs.readFile(require.resolve('buffer-es6/isArray'), 'utf8'),
    util: await fs.readFile(path.join(shims_dir, 'util.js'), 'utf8'),
    inherits: await fs.readFile(
      require.resolve(`rollup-plugin-node-builtins/src/es6/inherits.js`),
      'utf8'
    ),
    string_decoder: await fs.readFile(
      require.resolve('rollup-plugin-node-builtins/src/es6/string-decoder'),
      'utf8'
    ),
    path: await fs.readFile(path.join(shims_dir, 'path-with-posix.js'), 'utf8'),
    process: await fs.readFile(require.resolve('process-es6'), 'utf8'),
    tty: await fs.readFile(
      require.resolve('rollup-plugin-node-builtins/src/es6/tty'),
      'utf8'
    ),
    http: await fs.readFile(path.join(shims_dir, 'http.js'), 'utf8'),
    url: await fs.readFile(
      require.resolve('rollup-plugin-node-builtins/src/es6/url'),
      'utf8'
    ),
    querystring: await fs.readFile(
      require.resolve('rollup-plugin-node-builtins/src/es6/qs'),
      'utf8'
    ),
    punycode: await fs.readFile(
      require.resolve('rollup-plugin-node-builtins/src/es6/punycode'),
      'utf8'
    ),
  }
  const needs_shims = [
    'net',
    'events',
    'https',
    'querystring',
    'zlib',
    'http',
    'buffer',
    'crypto',
    'url',
    'util',
    'stream',
    'fs',
    'path',
    'string_decoder',
    'next/dist/compiled/@ampproject/toolbox-optimizer',
    'critters',
    'os',
    'process',
    // stream needs these
    'readable-stream/duplex.js',
    'readable-stream/readable.js',
    'readable-stream/writable.js',
    'readable-stream/transform.js',
    'readable-stream/passthrough.js',
    'readable-stream/buffer-list.js',
    // utils
    'inherits',
    // needed by mock express req/res
    'tty',
    // needed by url
    'punycode',
  ]
  needs_shims.forEach((gtfo) => {
    proto_fab.hypotheticals[gtfo] = shims[gtfo] || `module.exports = {}`
  })

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
  console.log('OMFG WAT')
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
