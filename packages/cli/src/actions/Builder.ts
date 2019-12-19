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

export default class Builder {
  static async build(config_path: string, config: FabConfig) {
    const build_plugins = Object.entries(config.build).map(
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

    const runtime_plugins = config.runtime.map((plugin_name) => {
      const requireable_plugin = relativeToConfig(config_path, plugin_name)

      const runtime = s_sume(
        () => {
          try {
            return require(requireable_plugin + '/runtime').runtime as FabPluginRuntime<
              PluginArgs,
              PluginMetadata
            >
          } catch (e) {
            return require(requireable_plugin).runtime as FabPluginRuntime<
              PluginArgs,
              PluginMetadata
            >
          }
        },
        () =>
          new InvalidConfigError(
            `The plugin '${plugin_name}' could not be found!\n` +
              `Looked for ${requireable_plugin +
                '/runtime'} and ${requireable_plugin}, expected a named export 'runtime'.`
          )
      )

      if (!runtime) {
        new InvalidPluginError(
          plugin_name,
          `The plugin '${plugin_name}' has no 'runtime' export, but is referenced in the 'runtime' section of the config!\n` +
            `Looked in ${requireable_plugin +
              '/runtime'} and ${requireable_plugin}, expected a named export 'runtime'.`
        )
      }

      return requireable_plugin
    })

    const proto_fab = new ProtoFab()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      console.log({ plugin_name, builder, plugin_args })
      await builder(plugin_args, proto_fab)
    }

    await Compiler.compile(proto_fab, runtime_plugins)
    await Generator.generate(proto_fab)
  }
}
