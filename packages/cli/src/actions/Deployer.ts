import path from 'path'
import { homedir } from 'os'
import fs from 'fs-extra'
import cli from 'cli-ux'
import jju from 'jju'
import { log, short_guid } from '../helpers'
import JSON5Config from '../helpers/JSON5Config'
import { FabConfig } from '@fab/core'
import shell from 'shelljs'
import decompress from 'decompress'

interface GlobalConfig {
  aws_key: string | undefined | null
  aws_secret: string | undefined | null
  cf_api_key: string | undefined | null
  cf_account_id: string | undefined | null
  cf_email: string | undefined | null
}

interface LocalConfig {
  cf_workers_name: string | undefined
  s3_asset_bucket: string | undefined
}

export default class Deployer {
  prompted_keys: Set<keyof GlobalConfig> = new Set()

  async deploy(
    file: string,
    config_file_path: string,
    flags: GlobalConfig & LocalConfig
  ) {
    const config = await JSON5Config.readFrom(config_file_path)

    const global_config_path = path.join(homedir(), '.fab', 'global.config.json5')
    const global_config = await this.getGlobalConfig(global_config_path, flags)
    if (this.prompted_keys.size) {
      await this.writeGlobalConfig(global_config_path, global_config)
    }

    const { aws_key, aws_secret, cf_api_key, cf_account_id, cf_email } = global_config

    const { cf_workers_name, s3_asset_bucket } = await this.getLocalConfig(
      config.data,
      flags
    )
    await this.writeLocalConfig(
      config,
      { cf_workers_name, s3_asset_bucket },
      config_file_path
    )

    log.info(
      `Deploying project as '${cf_workers_name}'.${
        !flags.cf_workers_name ? ' Use --cf_workers_name to override.' : ''
      }`
    )

    shell.config.fatal = true
    log.info(`Extracting ${file} to .fab/deploy`)
    shell.exec('rm -rf .fab/deploy')
    await decompress(file, '.fab/deploy')
    shell.exec('mkdir -p .fab/deploy/s3')
    shell.exec('mkdir -p .fab/deploy/cf')
    shell.exec('mv .fab/deploy/_assets .fab/deploy/s3')
    shell.exec(
      `cp ${path.resolve(__dirname, '../../templates/deploy/wrangler/*')} .fab/deploy/cf`
    )
    await fs.writeFile(
      '.fab/deploy/cf/wrangler.toml',
      `name = "${cf_workers_name}"
type = "webpack"
zone_id = ""
private = false
account_id = "${cf_account_id}"
route = ""
`
    )
    await fs.writeFile(
      '.fab/deploy/cf/s3-bucket-name.js',
      `module.exports = "${s3_asset_bucket}"`
    )
    shell.exec(`mv .fab/deploy/server.js .fab/deploy/cf`)

    log.info(`Creating bucket and uploading _assets to S3`)

    const bin_path = shell.exec(`npm bin`, { silent: true }).trim()

    shell.exec(
      `${bin_path}/theros create --bucket ${s3_asset_bucket} --key  ${aws_key} --secret ${aws_secret}`
    )
    shell.exec(
      `cd .fab/deploy/s3 && ${bin_path}/theros deploy --bucket ${s3_asset_bucket} --key  ${aws_key} --secret ${aws_secret}`
    )

    log.notify(`Deploying server to Cloudflare Workers using 🤠 Wrangler`)

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
      log.info(`No ~/.fab/global.config.json5 found. Please provide the following:`)
      return await this.promptConfig(flags)
    } else {
      log.info(`Reading from ~/.fab/global.config.json5.`)
      return await this.readConfig(config_path, flags)
    }
  }

  private async getLocalConfig(
    config: FabConfig,
    flags: LocalConfig
  ): Promise<LocalConfig> {
    const {
      cf_workers_name = await cli.prompt(
        'Enter project name (will deploy to https://{project_name}.{user_name}.workers.dev'
      ),
      s3_asset_bucket = `fab-assets-${short_guid()}-${cf_workers_name}`,
    } = {
      ...config.deploy,
      ...flags,
    } as LocalConfig
    return {
      cf_workers_name,
      s3_asset_bucket,
    }
  }

  private async prompt(key: keyof GlobalConfig, prompt: string): Promise<string> {
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
        'Enter Cloudflare Email (more info: https://fab.dev/kb/cf-config)'
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
    const file_config = await this.getGlobalConfigContents(config_path)

    return this.promptConfig({
      ...(file_config.deploy.s3 || {}),
      ...(file_config.deploy.cloudflare || {}),
      ...flags,
    })
  }

  private async getGlobalConfigContents(config_path: string) {
    return jju.parse(await fs.readFile(config_path, 'utf8')) || {}
  }

  private async writeGlobalConfig(
    config_path: string,
    config: GlobalConfig
  ): Promise<void> {
    const config_exists = await fs.pathExists(config_path)
    const existing_config = config_exists
      ? await this.getGlobalConfigContents(config_path)
      : { deploy: {} }
    existing_config.deploy = {
      s3: {},
      cloudflare: {},
      ...existing_config.deploy,
    }

    this.prompted_keys.forEach((key) => {
      if (key.startsWith('aws')) {
        existing_config.deploy.s3[key] = config[key]
      } else if (key.startsWith('cf')) {
        existing_config.deploy.cloudflare[key] = config[key]
      } else {
        log.error(`Unexpected config key ${key}`)
      }
    })

    await fs.ensureFile(config_path)
    await fs.writeFile(config_path, jju.stringify(existing_config, null, 2))
  }

  private async writeLocalConfig(
    config: JSON5Config,
    deploy_config: LocalConfig,
    file_path: string
  ): Promise<void> {
    config.data.deploy = {
      ...config.data.deploy,
      ...deploy_config,
    }

    await config.write(file_path)
  }
}
