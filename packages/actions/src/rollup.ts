import { OutputOptions, rollup, RollupOptions } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

// @ts-ignore
import alias from '@rollup/plugin-alias'
// @ts-ignore
import hypothetical from 'rollup-plugin-hypothetical'

export async function rollupCompile(
  input: string,
  generate_opts: OutputOptions,
  hypothetical_files = {},
  options: RollupOptions = {}
) {
  const empty = require.resolve(__dirname + '/empty')
  const entries = {
    path: require.resolve('path-browserify'),
    'node-fetch': empty,
  }

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
      commonjs(),
      typescript({ tsconfig: false }),
      json(),
    ],
    ...options,
  })
  return bundle.generate(generate_opts)
}
