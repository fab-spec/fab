import { log } from '../helpers'

export class InvalidPluginError extends Error {
  constructor(plugin_name: string, message: string) {
    super(`The plugin at '${plugin_name}' has errors!`)

    log.error(`Plugin error!\n\n${message}`)
  }
}
