import { FabConfig, FabPlugin } from '@fab/core'

export default class Builder {
  static build(config: FabConfig) {
    for (const [plugin_name, plugin_args] of Object.entries(config.build)) {
      console.log({ plugin_name, plugin_args })
      const plugin = require(plugin_name).default as FabPlugin
      console.log({plugin})
      plugin.build()
    }
  }
}
