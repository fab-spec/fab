import { OutputOptions, rollup, RollupOptions } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'

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
  const bundle = await rollup({
    input,
    plugins: [
      alias({
        entries: {
          path: require.resolve('path-browserify'),
        },
      }),
      hypothetical({
        files: hypothetical_files,
        allowFallthrough: true,
      }),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
    ],
    ...options,
  })
  return bundle.generate(generate_opts)
}
