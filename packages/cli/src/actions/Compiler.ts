import { ProtoFab } from '@fab/core'
import { log } from '../helpers'
import { BuildFailedError } from '../errors'
import Rollup from '../helpers/rollup'

export class Compiler {
  static async compile(proto_fab: ProtoFab, render_plugins: string[], rollup: Rollup) {
    console.log("It's compilin' time!")

    const { output, warnings } = await rollup.compile(
      require.resolve('@fab/cli/lib/runtime'),
      {
        generate: { format: 'iife', exports: 'named' },
        hypotheticals: {
          'user-defined-pipeline': generatePipelineJs(render_plugins),
          'fab-metadata': generateFabMetadataJs(proto_fab),
        },
      }
    )

    if (warnings.length > 0) {
      throw new BuildFailedError(
        `Errors encountered during Rollup build:\n\n  - ${warnings.join('\n  - ')}\n`
      )
    }
    // console.log(output)

    proto_fab.files.set('/server.js', output)
  }
}

function generatePipelineJs(plugin_runtimes: string[]) {
  return `
    ${plugin_runtimes
      .map((plugin, i) => `import { runtime as runtime_${i} } from '${plugin}'`)
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
