import { Command, flags } from '@oclif/command'
import { DEFAULT_CONFIG_FILENAME } from '@fab/core'
import Deployer from '../actions/Deployer'

export default class Deploy extends Command {
  static description = 'Command line deployer for FABs'

  static examples = [`$ fab-cf-workers deploy fab.zip`]

  static flags = {
    help: flags.help({ char: 'h' }),
    cf_workers_name: flags.string({
      char: 'n',
      description:
        'Name for project. Will deploy to https://{name}.{your_cf_username}.workers.dev',
    }),
    s3_asset_bucket: flags.string({ description: 'S3 Bucket name for asset upload' }),
    aws_key: flags.string({
      description: 'AWS Key for S3 upload (if not using ~/.fab/global.config.json5)',
    }),
    aws_secret: flags.string({
      description:
        'AWS Secret Key for S3 upload (if not using ~/.fab/global.config.json5)',
    }),
    cf_api_key: flags.string({
      description: 'Cloudflare Workers API key (if not using ~/.fab/global.config.json5)',
    }),
    cf_account_id: flags.string({
      description:
        'Cloudflare Workers Account ID (if not using ~/.fab/global.config.json5)',
    }),
    cf_email: flags.string({
      description:
        'Cloudflare Workers Account Email (if not using ~/.fab/global.config.json5)',
    }),
    config: flags.string({
      char: 'c',
      description: 'Path to local config file',
      default: DEFAULT_CONFIG_FILENAME,
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)
    const { file } = args

    if (!file) {
      this.error(`You must provide a FAB file to run (e.g. fab.zip)`)
    }

    await new Deployer().deploy(file, flags.config!, flags)
  }
}
