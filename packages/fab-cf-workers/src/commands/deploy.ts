import { Command, flags } from '@oclif/command'
import * as shell from 'shelljs'
import chalk from 'chalk'
import * as path from 'path'
import cli from 'cli-ux'
import sekrets from './sekrets'
import * as fs from 'fs-extra'

export default class Deploy extends Command {
  static description = 'describe the command here'

  static examples = [`$ fab-cf-workers deploy --name my-project-name`]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'Name for project' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)

    const name = flags.name || (await cli.prompt('Enter project name'))

    this.log(
      chalk.yellow(
        `Deploying project as '${name}'.${
          flags.name ? 'Use --name to override.' : ''
        }`
      )
    )

    const pwd = path.resolve()

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
    await fs.writeFile(
      '.fab/deploy/cf/s3-bucket-name.js',
      `export default "${name}-assets"`
    )
    shell.exec(`cp .fab/build/server.js .fab/deploy/cf`)

    this.log(chalk.yellow(`Creating bucket and uploading _assets to S3`))

    shell.exec(
      `theros create --bucket ${name}-assets --key  ${
        sekrets.aws_key
      } --secret ${sekrets.aws_secret}`
    )
    shell.exec(
      `cd .fab/deploy/s3 && theros deploy --bucket ${name}-assets --key  ${
        sekrets.aws_key
      } --secret ${sekrets.aws_secret}`
    )

    this.log(
      chalk.yellow(`Deploying server to Cloudflare Workers using 🤠 Wrangler`)
    )

    shell.exec(`cd .fab/deploy/cf && wrangler publish`)
  }
}
