import { Command, flags } from '@oclif/command'
import { DEFAULT_CONFIG_FILENAME } from '@fab/core'
import Initializer from '../actions/Initializer'

export default class Init extends Command {
  static description = 'Generate a FAB config on a new project'

  static examples = [`$ fab init`, `$ fab init --config=fab.config.json5`]

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'Config filename',
      default: DEFAULT_CONFIG_FILENAME,
    }),
    yes: flags.boolean({
      char: 'y',
      description:
        'Assume yes to all prompts (must be in the root directory of a project)',
    }),
    'skip-install': flags.boolean({
      description: 'Do not attempt to npm install anything',
    }),
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Init)
    await Initializer.init(flags.config, flags.yes, flags['skip-install'])
  }
}
