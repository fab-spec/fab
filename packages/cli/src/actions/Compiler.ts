import fs from 'fs-extra'
import { PluginMetadata, ProtoFab } from '@fab/core'
import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from '@rollup/plugin-json'
// @ts-ignore
import hypothetical from 'rollup-plugin-hypothetical'

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

    // await fs.writeFile('.fab/build/server.js', server_contents)

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
    const { output } = await bundle.generate({ format: 'esm' })
    console.log(output)

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
