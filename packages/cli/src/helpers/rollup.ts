import { InputOptions, OutputOptions, rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import fs from 'fs-extra'

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

  async compileAndRequire(path: string) {
    const { src, output } = await this.safeCompile(path)
    return {
      src,
      module: nodeEval(output),
    }
  }

  async safeCompile(path: string) {
    try {
      const contents = await fs.readFile(path, 'utf8')
      // console.log({contents})
      const src = contents.replace(
        /^\s*module.exports =/,
        'export const { build, runtime } ='
      )
      // console.log({ src })
      const { output } = await this.compile(path, {
        generate: { format: 'cjs', exports: 'named' },
        hypotheticals: {
          './entry-module': src,
        },
      })
      return {
        src,
        output,
      }
    } catch (rollup_e) {
      throw new BuildFailedError(
        `Rollup build failed for plugin ${path}. Rollup reported the following:\n  ${rollup_e}`
      )
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
        hypothetical({
          files: hypotheticals,
          allowFallthrough: true,
        }),
        resolve({
          preferBuiltins: true,
        }),
        globals(),
        builtins(),
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

    // console.log('#### INPUT ####')
    // console.log(input)
    // console.log('#### OUTPUT ####')
    // console.log(output.code)
    // console.log('\n\n')
    return { warnings, output: output.code }
  }
}
