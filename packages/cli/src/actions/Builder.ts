import {
  FabBuildStep,
  FabConfig,
  FabPluginRuntime,
  PluginArgs,
  PluginMetadata,
  ProtoFab,
  s_sume,
} from '@fab/core'
import { Compiler } from './Compiler'
import { Generator } from './Generator'
import { relativeToConfig } from '../helpers/paths'
import { InvalidConfigError, InvalidPluginError } from '../errors'
import { log } from '../helpers'

type RuntimePlugin = {
  path: string
  runtime: FabPluginRuntime<PluginArgs, PluginMetadata>
}

export default class Builder {
  static async build(config_path: string, config: FabConfig) {
    const build_plugins = Object.entries(config.plugins).map(
      ([plugin_name, plugin_args]) => {
        const builder = s_sume(
          () =>
            require(relativeToConfig(config_path, plugin_name)).build as FabBuildStep<
              PluginArgs,
              PluginMetadata
            >,
          (e) =>
            new InvalidConfigError(
              `Cannot find module '${plugin_name}', which was referenced in the 'build' config.\nAre you sure it's installed?`,
              e
            )
        )

        if (!builder)
          throw new InvalidPluginError(
            plugin_name,
            `The plugin '${plugin_name}' has no 'build' export, but is referenced in the 'build' section of the config!`
          )

        return {
          plugin_name,
          builder,
          plugin_args,
        }
      }
    )

    const runtime_plugins = Object.keys(config.plugins)
      .map((plugin_name) => {
        const requireable_plugin = relativeToConfig(config_path, plugin_name)

        const lookForRuntimeExport = (path: string) => {
          const { runtime } = require(path)
          return typeof runtime === 'function' ? path : undefined
        }
        const explicit_require = requireable_plugin + '/runtime'

        const path_with_runtime = s_sume(
          () => {
            try {
              const path = lookForRuntimeExport(explicit_require)
              if (path) return path
              log.warn(
                `Requiring '${explicit_require}' didn't export a 'runtime' function. Falling back to '${requireable_plugin}'`
              )
              return lookForRuntimeExport(requireable_plugin)
            } catch (e) {
              return lookForRuntimeExport(requireable_plugin)
            }
          },
          () =>
            new InvalidConfigError(
              `The plugin '${plugin_name}' could not be found!\n` +
                `Looked for ${explicit_require} first, then tried ${requireable_plugin}`
            )
        )

        return path_with_runtime
      })
      .filter((path): path is string => typeof path === 'string')

    const proto_fab = new ProtoFab()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      await builder(plugin_args, proto_fab)
    }

    console.log([runtime_plugins])
    await Compiler.compile(proto_fab, runtime_plugins)
    await Generator.generate(proto_fab)
  }
}
