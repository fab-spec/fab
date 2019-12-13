import {
  BuildFailedError,
  FabBuildStep,
  FabConfig,
  FabPluginRuntime,
  InvalidConfigError,
  InvalidPluginError,
  PluginArgs,
  PluginMetadata,
  ProtoFab,
  s_sume,
} from '@fab/core'
import { Compiler } from './Compiler'
import path from 'path'
import { relativeToConfig } from '../helpers/paths'

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
          () =>
            new InvalidConfigError(
              `Cannot find module '${plugin_name}', which was referenced in the 'build' config.\nAre you sure it's installed?`
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
            return require(requireable_plugin).render as FabPluginRuntime<
              PluginArgs,
              PluginMetadata
            >
          } catch (e) {
            return require(requireable_plugin + '/render').build as FabPluginRuntime<
              PluginArgs,
              PluginMetadata
            >
          }
        },
        () =>
          new InvalidPluginError(
            plugin_name,
            `The plugin '${plugin_name}' has no 'render' export, but is referenced in the 'runtime' section of the config!\n` +
              `Looked for ${requireable_plugin + '/render'} and ${requireable_plugin}`
          )
      )

      return requireable_plugin
    })

    const proto_fab = new ProtoFab<PluginMetadata>()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      console.log({ plugin_name, builder, plugin_args })
      await builder(plugin_args, proto_fab)
    }

    // After build, there should only be files in the expected places (server.js, _assets)
    const invalid_reason = proto_fab.readyForCompilation()
    if (invalid_reason) {
      throw new BuildFailedError(`FAB is not ready for compilation.
${invalid_reason}
You might need to add @fab/rewire-assets to your 'build' config. See https://fab.dev/packages/rewire-assets for more information about what this module is and why it's needed.
`)
    }

    await Compiler.compile(proto_fab, runtime_plugins)
  }
}
