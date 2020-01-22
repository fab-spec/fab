import { InputOptions, OutputOptions, rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'

// @ts-ignore
import alias from '@rollup/plugin-alias'
// @ts-ignore
import hypothetical from 'rollup-plugin-hypothetical'
import { FabConfig } from '@fab/core'
import { BuildFailedError } from '../errors'
// @ts-ignore
import nodeEval from 'node-eval'
import { log } from './index'

export default class Rollup {
  private config: FabConfig

  constructor(config: FabConfig) {
    this.config = config
  }

  async safeRequire(path: string) {
    try {
      return require(path)
    } catch (e) {
      try {
        const { output } = await this.compile(path, {
          generate: { format: 'cjs', exports: 'named' },
        })
        return nodeEval(output)
      } catch (e) {
        throw new BuildFailedError(
          `Rollup build failed for plugin ${path}. Rollup reported the following:\n  ${e}`
        )
      }
    }
  }

  async compile(
    input: string,
    {
      generate,
      hypotheticals = {},
      input_opts = {},
    }: {
      generate: OutputOptions
      hypotheticals?: {}
      input_opts?: InputOptions
    }
  ) {
    const warnings: string[] = []

    const bundle = await rollup({
      input,
      plugins: [
        alias({
          entries: {
            path: require.resolve('path-browserify'),
          },
        }),
        hypothetical({
          files: hypotheticals,
          allowFallthrough: true,
        }),
        resolve({
          preferBuiltins: true,
        }),
        commonjs(),
        typescript(),
        json(),
      ],

      onwarn(warning, handler) {
        if (warning.code === 'UNRESOLVED_IMPORT') {
          warnings.push(
            `Could not find module '${warning.source}' during build of '${warning.importer}'`
          )
        } else {
          handler(warning)
        }
      },
    })

    const {
      output: [output, ...chunks],
    } = await bundle.generate(generate)

    if (chunks.length > 0) {
      log.error(`WARNING: Didn't expect there to be more than one chunk created! Got:`)
      console.log(chunks)
    }

    return { warnings, output: output.code }
  }
}
