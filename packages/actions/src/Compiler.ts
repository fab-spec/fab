import { FabConfig, ProtoFab } from '@fab/core'
import { _log, BuildFailedError } from '@fab/cli'
import { rollupCompile } from './rollup'

const log = _log(`Compiler`)

export class Compiler {
  static async compile(config: FabConfig, proto_fab: ProtoFab, render_plugins: string[]) {
    log.time(() => `Compiling your 💛server.js💛:`)

    const warnings: string[] = []
    const {
      output: [output, ...chunks],
    } = await rollupCompile(
      require.resolve('@fab/cli/lib/runtime'),
      { format: 'umd', exports: 'named', name: '__fab' },
      {
        ...proto_fab.hypotheticals,
        'user-defined-pipeline': generatePipelineJs(render_plugins),
        'fab-metadata': generateFabMetadataJs(proto_fab),
        'production-settings': generateProductionSettings(config),
      },
      {
        onwarn(warning, handler) {
          if (warning.code === 'UNRESOLVED_IMPORT') {
            warnings.push(
              `Could not find module '${warning.source}' during build of '${warning.importer}'`
            )
          } else {
            handler(warning)
          }
        },
      }
    )

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

    proto_fab.files.set('/server.js', Buffer.from(output.code))
    log.time((d) => `Done in ${d}.`)
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

function generateProductionSettings(config: FabConfig) {
  return `
    export const production_settings = ${JSON.stringify(
      config.settings?.production || {}
    )}
  `
}
