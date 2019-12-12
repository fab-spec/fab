import fs from 'fs-extra'
import { PluginMetadata, ProtoFab, log } from '@fab/core'
import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
import util from 'util'

// @ts-ignore
import _zip from 'deterministic-zip'
const zip = util.promisify(_zip)

// @ts-ignore
import hypothetical from 'rollup-plugin-hypothetical'
import * as path from 'path'

export class Compiler {
  static async compile(proto_fab: ProtoFab<PluginMetadata>, render_plugins: string[]) {
    console.log("It's compilin' time!")

    await fs.emptyDir('.fab/build')

    const server_contents = `
${render_plugins
  .map(
    (plugin, i) => `
import { render as renderer_${i} } from '${plugin}/render'
`
  )
  .join('\n')}
    
const renderers = [
  ${render_plugins.map((plugin, i) => `renderer_${i}()`).join(',')}
]
`

    const bundle = await rollup({
      input: '@fab/cli/lib/runtime',
      plugins: [
        hypothetical({
          files: {
            './server.js': server_contents,
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
    } = await bundle.generate({ format: 'iife' })
    console.log(output)

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

    // await new Promise((resolve, reject) =>
    //   webpack(
    //     {
    //       mode: 'production',
    //       target: 'webworker',
    //       entry: './.fab/build/server.js',
    //       output: {
    //         path: path.resolve('.fab/built'),
    //         filename: 'server.js',
    //         library: 'server',
    //         libraryTarget: 'commonjs2',
    //       },
    //       optimization: {
    //         minimize: false
    //       },
    //     },
    //     (err, stats) => {
    //       if (err || stats.hasErrors()) {
    //         console.log('Build failed.')
    //         console.log(err)
    //         console.log(stats.toJson().errors.toString())
    //         reject()
    //       }
    //       resolve()
    //     }
    //   )
    // )
  }
}
