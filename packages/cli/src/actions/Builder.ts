import {
  BuildFailedError,
  FabConfig,
  FabPlugin,
  InvalidConfigError,
  PluginArgs,
  PluginMetadata,
  ProtoFab,
  ssume,
} from '@fab/core'
import { Compiler } from './Compiler'

export default class Builder {
  static async build(config: FabConfig) {
    const build_plugins = Object.entries(config.build).map(
      ([plugin_name, plugin_args]) => {
        return {
          plugin: ssume(
            () => require(plugin_name).default as FabPlugin<PluginArgs, PluginMetadata>,
            () =>
              new InvalidConfigError(
                `Cannot find module '${plugin_name}', which was referenced in the 'build' config.\nAre you sure it's installed?`
              )
          ),
          plugin_args,
        }
      }
    )

    const proto_fab = new ProtoFab<PluginMetadata>()
    for (const { plugin, plugin_args } of build_plugins) {
      await plugin.build(plugin_args, proto_fab)
    }

    // After build, there should only be files in the expected places (server.js, _assets)
    const invalid_reason = proto_fab.readyForCompilation()
    if (invalid_reason) {
      throw new BuildFailedError(`FAB is not ready for compilation.
${invalid_reason}
You might need to add @fab/rewire-assets to your 'build' config. See https://fab.dev/packages/rewire-assets for more information about what this module is and why it's needed.
`)
    }

    Compiler.compile(proto_fab, config.render)
  }
}
