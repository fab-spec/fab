import {
  FabDeployer,
  FabAssetsDeployer,
  FabServerDeployer,
  FabPackager,
  ConfigTypes,
  FabSettings,
} from '@fab/core'

import { log } from './utils'

export const createPackage: FabPackager<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  log('Creating dat package')
}
