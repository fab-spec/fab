import { FabBuildStep, FabConfig, PluginArgs, ProtoFab } from '@fab/core'
import { Compiler } from './Compiler'
import { Generator } from './Generator'
import { isRelative, relativeToConfig } from '../helpers/paths'
import { BuildFailedError, InvalidConfigError } from '../errors'
import { log } from '../helpers'
import Rollup from '../helpers/rollup'

const safeResolve = (path: string) => {
  try {
    return require.resolve(path)
  } catch (e) {
    return null
  }
}

const safeRequire = (path: string) => {
  try {
    return require(path)
  } catch (e) {
    return null
  }
}

type BuildPlugin = {
  plugin_name: string
  builder: FabBuildStep
  plugin_args: PluginArgs
}
type Plugins = {
  build_plugins: BuildPlugin[]
  runtime_plugins: string[]
}

export default class Builder {
  static async build(config_path: string, config: FabConfig) {
    const rollup = new Rollup(config)
    const { build_plugins, runtime_plugins } = await this.getPlugins(
      config_path,
      config,
      rollup
    )

    const proto_fab = new ProtoFab()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      console.log(`Building ${plugin_name}:`)
      await builder(plugin_args, proto_fab)
    }
    console.log([runtime_plugins])
    await Compiler.compile(proto_fab, runtime_plugins, rollup)
    await Generator.generate(proto_fab)
  }

  static async getPlugins(
    config_path: string,
    config: FabConfig,
    rollup: Rollup
  ): Promise<Plugins> {
    const build_plugins: BuildPlugin[] = []
    const runtime_plugins: string[] = []

    for (const [plugin_name, plugin_args] of Object.entries(config.plugins)) {
      const is_relative = isRelative(plugin_name)
      const relative_path = relativeToConfig(config_path, plugin_name)
      const plugin_path = safeResolve(relative_path)
      const relative_slash_require = relative_path + '/runtime'
      const path_slash_require = safeResolve(relative_slash_require)
      console.log({ is_relative, plugin_path, relative_path, path_slash_require })

      let runtime_plugin, build_plugin

      if (!plugin_path && !path_slash_require) {
        throw is_relative
          ? new InvalidConfigError(
              `The plugin '${plugin_name}' could not be found!\n` +
                `Looked for ${relative_slash_require} & ${relative_path}`
            )
          : new InvalidConfigError(
              `Cannot find module '${plugin_name}', which was referenced in the 'plugins' config.\nAre you sure it's installed?`
            )
      }

      // For @fab/something/runtime, expect it to be rollup-able.
      if (path_slash_require) {
        const module_slash_require = await rollup.compileAndRequire(path_slash_require)
        // By nodeEval-ing the rolled-up code, and getting a `runtime` function, we good.
        if (typeof module_slash_require.runtime === 'function') {
          runtime_plugin = path_slash_require
        } else {
          // _Technically_, if this exports nothing we can still look elsewhere, but it's weird
          log.warn(
            `Requiring '${relative_slash_require}' didn't export a 'runtime' function, but the filename indicates it probably should. Falling back to '${plugin_path}'`
          )
        }
      }

      // This needs to handle files and modules that export `build`, `runtime`, or both.
      if (plugin_path) {
        // First question, can Node require it directly?
        const node_require = safeRequire(plugin_path)
        if (node_require) {
          if (typeof node_require.runtime === 'function') {
            // If so, and it exports a runtime function, make sure Rollup is ok with it
            // (since that's what's about to compile it into the FAB)
            if (runtime_plugin) {
              // Unless, of course, we already loaded it from /runtime.
              log.warn(
                `Plugin ${plugin_name} exports a 'runtime' function, but we've already loaded it from '${path_slash_require}'.`
              )
            } else {
              await rollup.compileAndRequire(plugin_path)
              runtime_plugin = plugin_path
            }
          }

          // Given that we have a ridgy didge node module, chances are it exports `build`
          if (typeof node_require.build === 'function') {
            build_plugin = {
              plugin_name,
              builder: node_require.build,
              plugin_args,
            }
          }
        } else {
          // Ok, so node can't require this, but it does exist. It must be rollup-able.
          const module = await rollup.compileAndRequire(plugin_path)

          // After all this, anything it exports, we'll take.
          if (typeof module.build === 'function') {
            build_plugin = {
              plugin_name,
              builder: module.build,
              plugin_args,
            }
          }

          if (typeof module.runtime === 'function') {
            // Again, unless we already have one
            if (runtime_plugin) {
              log.warn(
                `Plugin ${plugin_name} exports a 'runtime' function, but we've already loaded it from '${path_slash_require}'.`
              )
            } else {
              runtime_plugin = plugin_path
            }
          }
        }
      }

      if (!runtime_plugin && !build_plugin) {
        log.warn(
          `Plugin ${plugin_name} exports neither a "build" or "runtime" export, ignoring it.`
        )
      }

      if (runtime_plugin) runtime_plugins.push(runtime_plugin)
      if (build_plugin) build_plugins.push(build_plugin)
    }

    return { build_plugins, runtime_plugins }
  }
}
