import { ProtoFab, BuildPlugin, RuntimePlugin } from '@fab/core'
import { _log, BuildFailedError } from '@fab/cli'
import { rollupCompile } from './rollup'
import nodeEval from 'node-eval'
import path from 'path'

const log = _log(`BuildPluginCompiler`)

export class BuildPluginCompiler {
  static async compileAndExecute(
    proto_fab: ProtoFab,
    plugins: BuildPlugin[],
    config_path: string,
    skip_cache: boolean
  ): Promise<RuntimePlugin[]> {
    log.time(() => `Compiling and executing your 💛build plugins💛:`)

    const code = await compile(config_path, proto_fab, plugins)

    const dynamic_runtimes: RuntimePlugin[] = await execute(
      code,
      proto_fab,
      config_path,
      skip_cache
    )

    log.time((d) => `Done in ${d}.`)

    return dynamic_runtimes
  }
}

async function compile(config_path: string, proto_fab: ProtoFab, plugins: BuildPlugin[]) {
  const warnings: string[] = []
  const indexFile = path.join(path.dirname(path.resolve(config_path)), 'index.ts')
  const {
    output: [output, ...chunks],
  } = await rollupCompile(indexFile, {
    output: { format: 'cjs', exports: 'named' },
    hypotheticals: {
      [indexFile]: generateBuildIndexScript(plugins),
      ...proto_fab.hypotheticals,
    },
    additional: {
      onwarn(warning, handler) {
        if (warning.code === 'UNRESOLVED_IMPORT') {
          warnings.push(
            `Could not find module '${warning.source}' during build of '${warning.importer}'`
          )
        } else {
          handler(warning)
        }
      },
      // let node_modules resolve themselves, no need to bundle them
      external: (mid) => /(node_modules)/g.test(mid),
    },
  })

  if (warnings.length > 0) {
    throw new BuildFailedError(
      `Errors encountered during Rollup build:\n\n  - ${warnings.join('\n  - ')}\n`
    )
  }

  if (chunks.length > 0) {
    log.error(`WARNING: Didn't expect there to be more than one chunk created! Got:`)
    console.log(chunks)
  }

  return output.code
}

async function execute(
  code: string,
  proto_fab: ProtoFab,
  config_path: string,
  skip_cache: boolean
) {
  try {
    /**
     * the second arg doesn't actually have to exist, but node-eval
     * requires a path to a .js file be provided if the code to
     * evaluate contains any `require` statements... ¯\_(ツ)_/¯
     * */
    const { dynamic_runtimes_promise } = nodeEval(
      code,
      path.join(path.dirname(path.resolve(config_path)), 'index.js'),
      {
        proto_fab,
        config_path,
        skip_cache,
      }
    )

    const result = await dynamic_runtimes_promise

    return result
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      throw new BuildFailedError(`Error occurred requiring a build plugin. Error message:
        ${e.message}`)
    }

    throw new BuildFailedError(`An unhandled error occurred. Error message:
      ${e.message}`)
  }
}

function generateBuildIndexScript(buildPlugins: BuildPlugin[]) {
  const importStatements = [] as string[]
  const executionStatements = [] as string[]

  buildPlugins.forEach((plugin, index) => {
    importStatements.push(generateImportStatement(plugin, index))
    executionStatements.push(generateExectionStatement(plugin, index))
  })

  const result = `
  ${importStatements.join('\n')}

  let dynamic_runtimes = [];

  const dynamic_runtimes_promise = (async function() {
    ${executionStatements.join('\n')}
    return dynamic_runtimes
  })();

  module.exports = { dynamic_runtimes_promise };
`
  return result
}

function generateImportStatement(plugin: BuildPlugin, index: number) {
  return `const build_${index} = require('${plugin.builder}').build;`
}

function generateExectionStatement(plugin: BuildPlugin, index: number) {
  return `const builder_output_${index} = await build_${index}(${JSON.stringify(
    plugin.plugin_args
  )}, proto_fab, config_path, skip_cache); dynamic_runtimes = dynamic_runtimes.concat(builder_output_${index} || []);`
}
