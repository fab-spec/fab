import fs from 'fs-extra'
import { PluginMetadata, ProtoFab } from '@fab/core'
import { rollup } from 'rollup'

export class Compiler {
  static async compile(proto_fab: ProtoFab<PluginMetadata>, render_plugins: [string?]) {
    console.log("It's compilin' time!")

    await fs.emptyDir('.fab/build')

    const server_contents = `
${render_plugins
  .map(
    (plugin, i) => `
import { render as renderer_${i} } from '${plugin}'
`
  )
  .join('\n')}
    
const renderers = [
  ${render_plugins.map((plugin, i) => `renderer_${i}()`).join(',')}
]
`

    await fs.writeFile('.fab/build/server.js', server_contents)

    const bundle = await rollup({
      input: '.fab/build/server.js',
    })
    const { output } = await bundle.generate({ format: 'esm' })
    console.log(output)
  }
}
