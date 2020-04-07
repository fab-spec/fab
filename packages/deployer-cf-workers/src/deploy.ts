import {
  FabDeployer,
  FabAssetsDeployer,
  FabServerDeployer,
  FabPackager,
  ConfigTypes,
  FabSettings,
} from '@fab/core'
import { log } from './utils'

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
  return 'lol'
}
