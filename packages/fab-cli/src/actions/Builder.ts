import { FabConfig } from '../types'

export default class Builder {
  static build(config: FabConfig) {
    for (const [plugin_name, plugin_args] of Object.entries(config.build)) {
      console.log({ plugin_name, plugin_args })
      const plugin = require(plugin_name)
      console.log({plugin})
    }
  }
}
