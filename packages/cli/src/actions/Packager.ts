import { HOSTING_PROVIDERS } from '@fab/core'
import JSON5Config from '../helpers/JSON5Config'

export default class Packager {
  static async package(config: JSON5Config, file_path: string, target: string) {
    const provider = HOSTING_PROVIDERS[target]
    if (!provider) {
      throw new Error(
        `Target '${target}' not supported. Needs to be one of ${Object.keys(
          HOSTING_PROVIDERS
        ).join(', ')}`
      )
    }
  }
}
