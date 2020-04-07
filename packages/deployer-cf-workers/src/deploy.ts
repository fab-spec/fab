import {
  FabDeployer,
  FabAssetsDeployer,
  FabServerDeployer,
  ConfigTypes,
  FabSettings,
} from '@fab/core'
import { getCloudflareApi, log } from './utils'
import { FabDeployError, InvalidConfigError } from '@fab/cli'
import { createPackage } from './createPackage'
import path from 'path'
import fs from 'fs-extra'

const notImplemented = () => {
  throw new Error(`Not implemented!
  The CF releaser currently only supports the server component.
  Please use @fab/deployer-aws-s3 to host assets instead.`)
}

export const deployBoth: FabDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings
) => notImplemented()

export const deployAssets: FabAssetsDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers
) => notImplemented()

export const deployServer: FabServerDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  const package_path = path.join(working_dir, 'cf-workers.js')

  log(`Starting deploy...`)

  if (!assets_url) {
    throw new FabDeployError(
      `Cloudflare Workers requires an assets_url, while KV is still not supported.`
    )
  }

  const { account_id, zone_id, route, api_token, workers_dev, script_name } = config

  if (!workers_dev) {
    throw new FabDeployError(`Only workers.dev deploys implemented as yet`)
  } else {
    const required_keys: Array<keyof ConfigTypes.CFWorkers> = [
      'account_id',
      'api_token',
      'script_name',
    ]
    const missing_config = required_keys.filter((k) => !config[k])
    if (missing_config.length > 0) {
      throw new InvalidConfigError(`Missing required keys for @fab/deploy-cf-workers:
      ${missing_config.map((k) => `💛• ${k}💛`).join('\n')}`)
    }
    const ignored_keys: Array<keyof ConfigTypes.CFWorkers> = ['zone_id', 'route']
    const ignored_config = ignored_keys.filter((k) => config[k])
    if (ignored_config.length > 0) {
      log(`💚NOTE:💚 ignoring the following config deploys with 💛workers_dev: true💛 don't need them:
      ${ignored_config.map((k) => `💛• ${k}: ${config[k]}💛`).join('\n')}`)
    }

    log(`💚✔💚 Config valid, checking API token...`)
    const api = await getCloudflareApi(api_token)

    log(`💚✔💚 API token valid, packaging...`)
    await createPackage(fab_path, package_path, config, env_overrides, assets_url)

    log.time(`Uploading script...`)
    const response = await api.put(
      `/accounts/${account_id}/workers/scripts/${script_name}`,
      {
        body: await fs.readFile(package_path, 'utf8'),
      }
    )
    if (!response.success) {
      throw new FabDeployError(`Error uploading the script, got response:
      ❤️${JSON.stringify(response)}❤️`)
    }
  }

  return 'lol'
}
