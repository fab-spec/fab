import {
  FabDeployer,
  FabAssetsDeployer,
  FabServerDeployer,
  FabPackager,
  ConfigTypes,
  FabSettings,
} from '@fab/core'

export const deployBoth: FabDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings
) => {
  throw new Error('Not implemented! Use `fab package` and deploy manually.')
}

export const deployAssets: FabAssetsDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers
) => {
  throw new Error('Not implemented! Use `fab package` and deploy manually.')
}

export const deployServer: FabServerDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  throw new Error('Not implemented! Use `fab package` and deploy manually.')
}

export const createPackage: FabPackager<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  console.log('CF WORKERS PACKAGER!')
}
