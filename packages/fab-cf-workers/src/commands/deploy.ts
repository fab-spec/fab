import { Command, flags } from '@oclif/command'
import * as shell from 'shelljs'
import chalk from 'chalk'
import * as path from 'path'
import cli from 'cli-ux'
import * as fs from 'fs-extra'
import { homedir } from 'os'
import { info, error, short_guid, log } from '../utils'
import * as decompress from 'decompress'

interface GlobalConfig {
  aws_key: string | undefined | null
  aws_secret: string | undefined | null
  cf_api_key: string | undefined | null
  cf_account_id: string | undefined | null
  cf_email: string | undefined | null
}

interface LocalConfig {
  name: string | undefined
  s3_bucket: string | undefined
}

export default class Deploy extends Command {
  static description = 'describe the command here'
  prompted_keys: Set<keyof GlobalConfig> = new Set()

  static examples = [`$ fab-cf-workers deploy fab.zip`]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'Name for project' }),
    s3_bucket: flags.string({ description: 'S3 Bucket name for asset upload' }),
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
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: 'fab.config.json',
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Deploy)
    const { file } = args

    if (!file) {
      this.error(`You must provide a FAB file to run (e.g. fab.zip)`)
    }

    const global_config_path = path.join(
      homedir(),
      '.fab',
      'global.config.json'
    )
    const global_config = await this.getGlobalConfig(global_config_path, flags)
    if (this.prompted_keys.size) {
      await this.writeGlobalConfig(global_config_path, global_config)
    }
    const {
      aws_key,
      aws_secret,
      cf_api_key,
      cf_account_id,
      cf_email,
    } = global_config

    const local_config_path = path.resolve(flags.config!)
    const { name, s3_bucket } = await this.getLocalConfig(
      local_config_path,
      flags
    )
    await this.writeLocalConfig(local_config_path, { name, s3_bucket })

    info(
      `Deploying project as '${name}'.${
        flags.name ? 'Use --name to override.' : ''
      }`
    )

    shell.config.fatal = true
    log(`Extracting ${file} to .fab/deploy`)
    shell.exec('rm -rf .fab/deploy')
    await decompress(file, '.fab/deploy')
    shell.exec('mkdir -p .fab/deploy/s3')
    shell.exec('mkdir -p .fab/deploy/cf')
    shell.exec('mv .fab/deploy/_assets .fab/deploy/s3')
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
account_id = "${cf_account_id}"
route = ""
`
    )
    await fs.writeFile(
      '.fab/deploy/cf/s3-bucket-name.js',
      `export default "${s3_bucket}"`
    )
    shell.exec(`mv .fab/deploy/server.js .fab/deploy/cf`)

    info(`Creating bucket and uploading _assets to S3`)

    const bin_path = shell.exec(`npm bin`).trim()

    shell.exec(
      `${bin_path}/theros create --bucket ${s3_bucket} --key  ${aws_key} --secret ${aws_secret}`
    )
    shell.exec(
      `cd .fab/deploy/s3 && ${bin_path}/theros deploy --bucket ${s3_bucket} --key  ${aws_key} --secret ${aws_secret}`
    )

    info(
      chalk.yellow(`Deploying server to Cloudflare Workers using 🤠 Wrangler`)
    )

    shell.exec(
      `cd .fab/deploy/cf && CF_API_KEY="${cf_api_key}" CF_EMAIL="${cf_email}" ${bin_path}/wrangler publish`
    )
  }

  private async getGlobalConfig(
    config_path: string,
    flags: GlobalConfig
  ): Promise<GlobalConfig> {
    const { aws_key, aws_secret, cf_api_key, cf_account_id, cf_email } = flags
    if (aws_key && aws_secret && cf_api_key && cf_account_id && cf_email) {
      return { aws_key, aws_secret, cf_api_key, cf_account_id, cf_email }
    }

    // Only save updated values for keys that we prompted for, not flags
    this.prompted_keys.clear()
    if (!(await fs.pathExists(config_path))) {
      info(`No ~/.fab/global.config.json found. Please provide the following:`)
      return await this.promptConfig(flags)
    } else {
      info(`Reading from ~/.fab/global.config.json.`)
      return await this.readConfig(config_path, flags)
    }
  }

  private async getLocalConfig(
    config_path: string,
    flags: LocalConfig
  ): Promise<LocalConfig> {
    const config_exists = await fs.pathExists(config_path)
    const {
      name = await cli.prompt('Enter project name'),
      s3_bucket = `fab-assets-${short_guid()}-${name}`,
    } = {
      ...((config_exists &&
        JSON.parse(await fs.readFile(config_path, 'utf8'))) ||
        {}),
      ...flags,
    } as LocalConfig
    return {
      name,
      s3_bucket,
    }
  }

  private async prompt(
    key: keyof GlobalConfig,
    prompt: string
  ): Promise<string> {
    this.prompted_keys.add(key)
    const result = await cli.prompt(prompt)
    if (!result) throw new Error('You must provide a response.')
    return result
  }

  private async promptConfig(flags: GlobalConfig): Promise<GlobalConfig> {
    const {
      aws_key = await this.prompt(
        'aws_key',
        'Enter AWS key (more info: https://fab.dev/kb/s3-config)'
      ),
      aws_secret = await this.prompt(
        'aws_secret',
        'Enter AWS Secret (more info: https://fab.dev/kb/s3-config)'
      ),
      cf_account_id = await this.prompt(
        'cf_account_id',
        'Enter Cloudflare Account ID (more info: https://fab.dev/kb/cf-config)'
      ),
      cf_email = await this.prompt(
        'cf_email',
        'Enter Cloudflare Email (more info: https://fab.dev/kb/cf_email)'
      ),
      cf_api_key = await this.prompt(
        'cf_api_key',
        'Enter Cloudflare API key (more info: https://fab.dev/kb/cf-config)'
      ),
    } = flags

    return { aws_key, aws_secret, cf_api_key, cf_account_id, cf_email }
  }

  private async readConfig(
    config_path: string,
    flags: GlobalConfig
  ): Promise<GlobalConfig> {
    const file_config = JSON.parse(await fs.readFile(config_path, 'utf8')) || {}

    return this.promptConfig({
      ...(file_config.s3 || {}),
      ...(file_config.cloudflare || {}),
      ...flags,
    })
  }

  private async writeGlobalConfig(
    config_path: string,
    config: GlobalConfig
  ): Promise<void> {
    const config_exists = await fs.pathExists(config_path)
    const existing_config =
      (config_exists && JSON.parse(await fs.readFile(config_path, 'utf8'))) ||
      {}
    existing_config.s3 = existing_config.s3 || {}
    existing_config.cloudflare = existing_config.cloudflare || {}

    this.prompted_keys.forEach((key) => {
      if (key.startsWith('aws')) {
        existing_config.s3[key] = config[key]
      } else if (key.startsWith('cf')) {
        existing_config.cloudflare[key] = config[key]
      } else {
        error(`Unexpected config key ${key}`)
      }
    })

    await fs.ensureFile(config_path)
    await fs.writeFile(config_path, JSON.stringify(existing_config, null, 2))
  }

  private async writeLocalConfig(
    config_path: string,
    config: LocalConfig
  ): Promise<void> {
    const config_exists = await fs.pathExists(config_path)
    const existing_config =
      (config_exists && JSON.parse(await fs.readFile(config_path, 'utf8'))) ||
      {}
    const merged_config = {
      ...existing_config,
      ...config,
    }

    await fs.ensureFile(config_path)
    await fs.writeFile(config_path, JSON.stringify(merged_config, null, 2))
  }
}
