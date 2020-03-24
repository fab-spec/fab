import { Command, flags } from '@oclif/command'
import JSON5Config from '../helpers/JSON5Config'
import { DEFAULT_CONFIG_FILENAME } from '@fab/core'
import Packager from '../actions/Packager'

export default class Deploy extends Command {
  static description = 'Package a FAB to be uploaded to a hosting provider manually'

  static examples = [`$ fab package --target=aws-lambda-edge fab.zip`]

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: DEFAULT_CONFIG_FILENAME,
    }),
    target: flags.string({
      char: 't',
      description: `Hosting provider (currently one of 'aws-lambda-edge', 'cf-workers')`,
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)
    const { file } = args
    const { target } = flags

    if (!file) {
      this.error(`You must provide a FAB file to package (e.g. fab.zip)`)
    }
    if (!target) {
      this.error(`You must provide a target.`)
    }
    const config = await JSON5Config.readFrom(flags.config!)
    await Packager.package(config, file, target)
  }
}
