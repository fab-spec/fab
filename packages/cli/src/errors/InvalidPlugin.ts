import { log } from '../helpers'

export class InvalidPluginError extends Error {
  constructor(plugin_name: string, message: string) {
    super(`The plugin at '${plugin_name}' has errors!`)

    log.error(`ERROR: Problem with plugin '${plugin_name}'.\n\n${message}`)
  }
}
