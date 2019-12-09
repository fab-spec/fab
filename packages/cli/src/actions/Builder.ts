import { FabConfig, FabPlugin, InvalidConfigError, ProtoFab, ssume } from '@fab/core'

/*
 *
 * build: {
 *   "@fab/rewire-assets": { ... }
 *
 * */

export default class Builder {
  static async build(config: FabConfig) {
    const build_plugins = Object.entries(config.build).map(
      ([plugin_name, plugin_args]) => {
        return {
          plugin: ssume(
            () => require(plugin_name).default as FabPlugin,
            () =>
              new InvalidConfigError(
                `Cannot find module '${plugin_name}', which was referenced in the 'build' config.\nAre you sure it's installed?`
              )
          ),
          plugin_args,
        }
      }
    )

    const proto_fab = new ProtoFab()
    for (const { plugin, plugin_args } of build_plugins) {
      await plugin.build(plugin_args, proto_fab)
    }
  }
}
