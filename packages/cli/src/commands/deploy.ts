import { Command, flags } from '@oclif/command'
import {
  DEFAULT_CONFIG_FILENAME,
  DeployProviders,
  FabActionsExports,
  HOSTING_PROVIDERS,
} from '@dev-spendesk/core'
import { JSON5Config } from '../'
import fs from 'fs-extra'

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
      multiple: true,
    }),
    'assets-already-deployed-at': flags.string({
      description:
        'Skip asset deploys and only deploy the server component pointing at this URL for assets',
    }),
    'assets-only': flags.boolean({
      description: 'Skip server deploy, just upload assets',
    }),
    'auto-install': flags.boolean({
      description:
        'If you need dependent packages (e.g. @dev-spendesk/deploy-*), install them without prompting',
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)

    const { file: specified_file } = args
    const default_file = 'fab.zip'

    if (specified_file) {
      if (!(await fs.pathExists(specified_file))) {
        this.error(`ERROR: Cannot file find file '${specified_file}'.\n`)
        this._help()
      }
    } else if (!(await fs.pathExists(default_file))) {
      this.error(
        `ERROR: You must provide a FAB filename to deploy, if '${default_file}' is not present in the current directory.\n`
      )
      this._help()
    }

    const file = specified_file || default_file

    const config = await JSON5Config.readFrom(flags.config!)
    const { Deployer } = require('@dev-spendesk/actions').default as FabActionsExports
    await Deployer.deploy(
      config,
      file,
      flags['package-dir'] || '.fab/deploy',
      flags['server-host'],
      flags['assets-host'],
      flags.env,
      flags['assets-only'],
      flags['assets-already-deployed-at'],
      flags['auto-install']
    )
  }
}
