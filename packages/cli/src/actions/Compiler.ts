import { ProtoFab } from '@fab/core'
import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
// @ts-ignore
import hypothetical from 'rollup-plugin-hypothetical'
import { log } from '../helpers'
// @ts-ignore
import alias from '@rollup/plugin-alias'
import { BuildFailedError } from '../errors'

export class Compiler {
  static async compile(proto_fab: ProtoFab, render_plugins: string[]) {
    console.log("It's compilin' time!")

    const warnings: string[] = []
    const bundle = await rollup({
      input: require.resolve('@fab/cli/lib/runtime'),
      plugins: [
        alias({
          entries: {
            path: require.resolve('path-browserify'),
          },
        }),
        hypothetical({
          files: {
            'user-defined-pipeline': generatePipelineJs(render_plugins),
            'fab-metadata': generateFabMetadataJs(proto_fab),
          },
          allowFallthrough: true,
        }),
        resolve({
          preferBuiltins: true,
        }),
        commonjs(),
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
    } = await bundle.generate({ format: 'iife', exports: 'named' })

    if (warnings.length > 0) {
      throw new BuildFailedError(
        `Errors encountered during Rollup build:\n\n  - ${warnings.join('\n  - ')}\n`
      )
    }
    // console.log(output)

    if (chunks.length > 0) {
      log.error(`WARNING: Didn't expect there to be more than one chunk created! Got:`)
      console.log(chunks)
    }

    proto_fab.files.set('/server.js', output.code)
  }
}

function generatePipelineJs(plugin_runtimes: string[]) {
  return `
    ${plugin_runtimes
      .map((plugin, i) => `import { runtime as runtime_${i} } from '${plugin}/runtime'`)
      .join('\n')}

    export const runtimes = [
      ${plugin_runtimes.map((plugin, i) => `runtime_${i}`).join(',')}
    ]
  `
}

function generateFabMetadataJs(proto_fab: ProtoFab) {
  return `
    export const fab_metadata = ${proto_fab.toJSON()};
  `
}
