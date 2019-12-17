import fs from 'fs-extra'
import { log, ProtoFab } from '@fab/core'
import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
import util from 'util'
// @ts-ignore
import _zip from 'deterministic-zip'
// @ts-ignore
import hypothetical from 'rollup-plugin-hypothetical'
import * as path from 'path'

const zip = util.promisify(_zip)

export class Compiler {
  static async compile(proto_fab: ProtoFab, render_plugins: string[]) {
    console.log("It's compilin' time!")

    await fs.emptyDir('.fab/build')

    const bundle = await rollup({
      input: '@fab/cli/lib/runtime',
      plugins: [
        hypothetical({
          files: {
            'user-defined-pipeline': generatePipelineJs(render_plugins),
            'fab-metadata': generateFabMetadataJs(proto_fab),
          },
          allowFallthrough: true,
        }),
        resolve(),
        commonjs(),
        json(),
      ],
    })
    const {
      output: [output, ...chunks],
    } = await bundle.generate({ format: 'iife', exports: 'named' })
    // console.log(output)

    if (chunks.length > 0) {
      log.error(`WARNING: Didn't expect there to be more than one chunk created! Got:`)
      console.log(chunks)
    }
    await fs.writeFile('.fab/build/server.js', output.code)

    console.log(`Zipping it up into a FAB`)
    const zipfile = path.resolve('fab.zip')
    const build_dir = path.resolve('.fab/build')
    const options = {
      includes: ['./server.js', './_assets/**'],
      cwd: build_dir,
    }
    await zip(build_dir, zipfile, options)
    const stats2 = await fs.stat(zipfile)
    console.log(
      `    ${path.relative(process.cwd(), zipfile)} (${Math.round(stats2.size / 1024) +
        'KB'})`
    )
  }
}

function generatePipelineJs(render_plugins: string[]) {
  return `
    ${render_plugins
      .map((plugin, i) => `import { render as renderer_${i} } from '${plugin}/render'`)
      .join('\n')}
        
    export const renderers = [
      ${render_plugins.map((plugin, i) => `renderer_${i}`).join(',')}
    ]
  `
}

function generateFabMetadataJs(proto_fab: ProtoFab) {
  return `
    export const fab_metadata = ${proto_fab.toJSON()};
  `
}
