import { FabConfig } from '@fab/core'
import JSON5Config from '../helpers/JSON5Config'

export default class Deployer {
  static async deploy(
    config: JSON5Config,
    file_path: string,
    output_path: string | undefined
  ) {
    throw new Error('Not implemented')
  }
}
