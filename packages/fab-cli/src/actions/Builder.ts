import {FabConfig, FabPlugin, ProtoFab} from '@fab/core'

export default class Builder {
  static build(config: FabConfig) {
    const proto_fab = new ProtoFab()
    for (const [plugin_name, plugin_args] of Object.entries(config.build)) {
      const plugin = require(plugin_name).default as FabPlugin
      plugin.build(plugin_args, proto_fab)
    }
  }
}
