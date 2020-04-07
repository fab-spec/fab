import {
  FabDeployer,
  FabAssetsDeployer,
  FabServerDeployer,
  FabPackager,
  ConfigTypes,
  FabSettings,
} from '@fab/core'
import { log } from './utils'
import { FabPackageError, InvalidConfigError } from '@fab/cli'

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
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  log('Deploying dat server')

  if (!assets_url) {
    throw new FabPackageError(
      `Cloudflare Workers requires an assets_url, while KV is still not supported.`
    )
  }

  const { account_id, zone_id, route, api_key, workers_dev, script_name } = config

  if (!workers_dev) {
    throw new FabPackageError(`Only workers.dev deploys implemented as yet`)
  } else {
    const required_keys: Array<keyof ConfigTypes.CFWorkers> = [
      'account_id',
      'api_key',
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
  }

  return 'lol'
}
