import { Command, flags } from '@oclif/command'
import JSON5Config from '../helpers/JSON5Config'
import { DEFAULT_CONFIG_FILENAME, DeployProviders, HOSTING_PROVIDERS } from '@fab/core'
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
    'package-dir': flags.string({
      description: 'Where to save the packaged FAB files (default .fab/deploy)',
    }),
    'server-host': flags.enum<DeployProviders>({
      options: Object.keys(HOSTING_PROVIDERS),
      description:
        'If you have multiple potential hosts for the server defined in your fab.config.json5, which one to deploy to.',
    }),
    'assets-host': flags.enum<DeployProviders>({
      options: Object.keys(HOSTING_PROVIDERS),
      description:
        'If you have multiple potential hosts for the assets defined in your fab.config.json5, which one to deploy to.',
    }),
    env: flags.string({
      description:
        'Override production settings with a different environment defined in your FAB config file.',
    }),
    'assets-already-deployed-at': flags.string({
      description:
        'Skip asset deploys and only deploy the server component pointing at this URL for assets',
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
    await Deployer.deploy(
      config,
      file,
      flags['package-dir'] || '.fab/deploy',
      flags['server-host'],
      flags['assets-host'],
      flags.env,
      flags['assets-already-deployed-at']
    )
  }
}
