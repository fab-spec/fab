import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { FabBuildStep } from '@fab/core'
import path from 'path'
import { _log, InvalidConfigError } from '@fab/cli'
import { preflightChecks } from './preflightChecks'
import globby from 'globby'
import fs from 'fs-extra'
import generateRenderer from './generateRenderer'
// @ts-ignore
import md5dir from 'md5-dir/promise'

const log = _log(`@fab/input-nextjs`)

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

  proto_fab._rollup.hypotheticals[`${RENDERER}.js`] = entry_point
  proto_fab._rollup.aliases.stream = require.resolve(
    `rollup-plugin-node-builtins/src/es6/stream`
  )

  const shimz: { [name: string]: string | boolean } = {
    events: 'builtins',
    stream: 'builtins',
    buffer: 'shim',
    isArray: 'resolve:buffer-es6/isArray',
    util: 'shim',
    inherits: 'builtins',
    string_decoder: 'builtins:string-decoder',
    path: 'shim:path-with-posix',
    process: 'resolve:process-es6',
    tty: 'builtins',
    http: 'shim',
    url: 'builtins',
    querystring: 'builtins:qs',
    punycode: 'builtins',
    crypto: 'shim',
    net: false,
    https: false,
    zlib: false,
    fs: false,
    'next/dist/compiled/@ampproject/toolbox-optimizer': false,
    critters: false,
    os: false,
  }

  // const needs_shims = [
  //   // utils
  //   // needed by mock express req/res
  //   'tty',
  //   // needed by url
  //   'punycode',
  // ]
  for (const [name, instr] of Object.entries(shimz)) {
    if (typeof instr === 'string') {
      const [where, alias = name] = instr.split(':')
      proto_fab._rollup.aliases[name] =
        where === 'builtins'
          ? require.resolve(`rollup-plugin-node-builtins/src/es6/${alias}`)
          : where === 'shim'
          ? path.join(shims_dir, alias + '.js')
          : require.resolve(alias)
    } else if (!instr) {
      proto_fab._rollup.hypotheticals[name] = `module.exports = {}`
    } else {
      throw new Error(`shim: true has no meaning yet. For '${name}'`)
    }
  }

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
