import { Command, flags } from '@oclif/command'
import { DEFAULT_CONFIG_FILENAME } from '@dev-spendesk/fab-core'
import Initializer from '../Initializer'

export default class Init extends Command {
  static description = Initializer.description

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
    version: flags.string({
      description: 'What NPM version or dist-tag to use for installing FAB packages',
    }),
    'skip-framework-detection': flags.boolean({
      description: "Don't try to auto-detect framework, set up manually.",
    }),
    empty: flags.boolean({
      description:
        'Install the packages and create an empty fab.config.json5 (implies -y)',
    }),
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Init)
    await Initializer.init(
      flags.config,
      flags.yes,
      flags['skip-install'],
      flags.version,
      flags['skip-framework-detection'],
      flags.empty
    )
  }
}
