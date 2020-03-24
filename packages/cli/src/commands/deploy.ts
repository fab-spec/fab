import { Command, flags } from '@oclif/command'
import JSON5Config from '../helpers/JSON5Config'
import { DEFAULT_CONFIG_FILENAME } from '@fab/core'
import Deployer from '../actions/Deployer'

export default class Deploy extends Command {
  static description = 'Deploy a FAB to a hosting provider'

  static examples = [`$ fab deploy fab.zip`]

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: DEFAULT_CONFIG_FILENAME,
    }),
    'output-path': flags.string({
      description: 'Where to save the packaged FAB (default ./fab/deploy/[target].zip)',
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)
    const { file } = args

    if (!file) {
      this.error(`You must provide a FAB file to deploy (e.g. fab.zip)`)
    }
    const config = await JSON5Config.readFrom(flags.config!)
    await Deployer.deploy(config, file, flags['output-path'])
  }
}
