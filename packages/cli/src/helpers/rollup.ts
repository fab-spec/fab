import { OutputOptions, rollup, RollupOptions } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import inject from '@rollup/plugin-inject'
import replace from '@rollup/plugin-replace'
// @ts-ignore
import builtins from 'rollup-plugin-node-builtins'

// @ts-ignore
import alias from '@rollup/plugin-alias'
// @ts-ignore
import hypothetical from 'rollup-plugin-hypothetical'
import path from 'path'

export async function rollupCompile(
  input: string,
  generate_opts: OutputOptions,
  hypothetical_files = {},
  options: RollupOptions = {}
) {
  const empty = require.resolve(__dirname + '/empty')
  const entries = {
    path: require.resolve('path-browserify'),
    events: require.resolve('events/events'),
    util: require.resolve('util/util'),
    url: require.resolve('url/url'),
    punycode: require.resolve('punycode/punycode'),
    stream: require.resolve('stream-browserify'),
    crypto: require.resolve('crypto-browserify'),
    // crypto: require.resolve('crypto-browserify'),
    fs: require.resolve('memfs'),
    process: require.resolve('process/index'),
    // process: require.resolve('process/index'),
    assert: require.resolve('assert/build/assert'),
    buffer: require.resolve('buffer/index'),
    randombytes: require.resolve('randombytes/browser'),
    'create-hash': require.resolve('create-hash/browser'),
    // http: require.resolve('stream-http'),
    // https: empty,//require.resolve('https-browserify'),
    // zlib: empty,//require.resolve('browserify-zlib'),
    vm: require.resolve('vm-browserify'),
    'node-fetch': empty,
  }
  console.log(entries)

  const bundle = await rollup({
    input,
    plugins: [
      hypothetical({
        files: hypothetical_files,
        allowFallthrough: true,
      }),
      alias({ entries }),
      resolve({
        preferBuiltins: true,
      }),
      replace({
        'process.browser': 'true',
        'cryptoBrowserify.createHmac': '() => {}',
      }),
      //   'global.setTimeout': 'setTimeout',
      //   'global.clearTimeout': 'setTimeout',
      //   'global.TYPED_ARRAY_SUPPORT': 'undefined',
      //   'global.fetch': 'fetch',
      //   'global.ReadableStream': 'fetch.ReadableStream',
      //   'global.ArrayBuffer': 'ArrayBuffer',
      // }),
      // builtins(),
      commonjs(),
      typescript(),
      json(),
      inject({
        Buffer: 'buffer',
      }),
    ],
    ...options,
  })
  return bundle.generate(generate_opts)
}
