import { DEFAULT_CONFIG_FILENAME, HOSTING_PROVIDERS, DeployProviders } from '@fab/core'
import { Command, flags } from '@oclif/command'
import Packager from '../actions/Packager'
import JSON5Config from '../helpers/JSON5Config'

const hosts = Object.keys(HOSTING_PROVIDERS)
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
    target: flags.enum<DeployProviders>({
      options: hosts,
      char: 't',
      description: `Hosting provider (must be one of: ${hosts.join(', ')})`,
    }),
    'output-path': flags.string({
      description: 'Where to save the packaged FAB (default .fab/deploy/[target].zip)',
    }),
    'asset-url': flags.string({
      description:
        'A URL for where the assets can be accessed, for server deployers that need it',
    }),
    env: flags.string({
      description:
        'Override production settings with a different environment defined in your FAB config file.',
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)
    const { file } = args
    if (!file) {
      this.error(`You must provide a FAB file to package (e.g. fab.zip)`)
    }
    if (!flags.target) {
      this.error(`You must provide a target. Available options: ${hosts.join(', ')}`)
    }
    const config = await JSON5Config.readFrom(flags.config!)
    await Packager.package(
      file,
      config.data,
      flags.target,
      flags['output-path'],
      flags['asset-url']!,
      flags.env
    )
  }
}
