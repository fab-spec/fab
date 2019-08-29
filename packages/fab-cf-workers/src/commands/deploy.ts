import { Command, flags } from '@oclif/command'
import * as shell from 'shelljs'
import chalk from 'chalk'
import * as path from 'path'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
import { homedir } from 'os'
import {info, log} from '../utils'

interface Config {
  aws_key: string | undefined
  aws_secret: string | undefined
  cf_api_key: string | undefined
  cf_account_id: string | undefined
  cf_email: string | undefined
}

export default class Deploy extends Command {
  static description = 'describe the command here'

  static examples = [`$ fab-cf-workers deploy --name my-project-name`]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'Name for project' }),
    aws_key: flags.string({
      description:
        'AWS Key for S3 upload (if not using ~/.fab/global.config.json)',
    }),
    aws_secret: flags.string({
      description:
        'AWS Secret Key for S3 upload (if not using ~/.fab/global.config.json)',
    }),
    cf_api_key: flags.string({
      description:
        'Cloudflare Workers API key (if not using ~/.fab/global.config.json)',
    }),
    cf_account_id: flags.string({
      description:
        'Cloudflare Workers Account ID (if not using ~/.fab/global.config.json)',
    }),
    cf_email: flags.string({
      description:
        'Cloudflare Workers Account Email (if not using ~/.fab/global.config.json)',
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)

    const config = await this.getConfig(flags)

    const name = flags.name || (await cli.prompt('Enter project name'))

    info(
      `Deploying project as '${name}'.${
        flags.name ? 'Use --name to override.' : ''
      }`
    )

    shell.exec('rm -rf .fab/deploy')
    shell.exec('mkdir -p .fab/deploy/s3')
    shell.exec('mkdir -p .fab/deploy/cf')
    shell.exec('cp -r .fab/build/_assets .fab/deploy/s3')
    shell.exec(
      `cp ${path.resolve(
        __dirname,
        '../files/wrangler-template/*'
      )} .fab/deploy/cf`
    )
    await fs.writeFile(
      '.fab/deploy/cf/wrangler.toml',
      `name = "${name}"
type = "webpack"
zone_id = ""
private = false
account_id = "${sekrets.cf_account_id}"
route = ""
`
    )
    const s3_bucket_name = `fab-${name}`
    await fs.writeFile(
      '.fab/deploy/cf/s3-bucket-name.js',
      `export default "${s3_bucket_name}"`
    )
    shell.exec(`cp .fab/build/server.js .fab/deploy/cf`)

    this.log(chalk.yellow(`Creating bucket and uploading _assets to S3`))

    shell.exec(
      `theros create --bucket ${s3_bucket_name} --key  ${
        sekrets.aws_key
      } --secret ${sekrets.aws_secret}`
    )
    shell.exec(
      `cd .fab/deploy/s3 && theros deploy --bucket ${s3_bucket_name} --key  ${
        sekrets.aws_key
      } --secret ${sekrets.aws_secret}`
    )

    this.log(
      chalk.yellow(`Deploying server to Cloudflare Workers using 🤠 Wrangler`)
    )

    shell.exec(`cd .fab/deploy/cf && wrangler publish`)
  }

  private async getConfig(flags: Config): Config {
    const { aws_key, aws_secret, cf_api_key, cf_account_id, cf_email } = flags
    const config_path = path.join(homedir(), '.fab', 'global.config.json')
    if (aws_key && aws_secret && cf_api_key && cf_account_id && cf_email) {
      return { aws_key, aws_secret, cf_api_key, cf_account_id, cf_email }
    }

    if (!(await fs.pathExists(config_path))) {
      info(`No ~/.fab/global.config.json found. Please provide the following:`)
      const config = promptConfig(flags)
    }
  }

  private async getConfig(flags: Config): Config {
    const {
      aws_key = (await cli.prompt('Enter AWS key (see https://')),
      aws_secret = (await cli.prompt('Enter AWS Secret'))
    } = flags

  }
}
