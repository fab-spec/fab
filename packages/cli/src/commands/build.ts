import { Command, flags } from '@oclif/command'
import JSON5Config from '../helpers/JSON5Config'
import { DEFAULT_CONFIG_FILENAME } from '@fab/core'
import Builder from '../actions/Builder'

export default class Build extends Command {
  static description = 'Generate a FAB given the config (usually in fab.config.json5)'

  static examples = [`$ fab build`, `$ fab build --config=fab.config.json5`]

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: DEFAULT_CONFIG_FILENAME,
    }),
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Build)
    const config = await JSON5Config.readFrom(flags.config!)
    await Builder.build(flags.config, config.data)
  }
}
