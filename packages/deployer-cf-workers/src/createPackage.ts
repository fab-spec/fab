import {
  FabDeployer,
  FabAssetsDeployer,
  FabServerDeployer,
  FabPackager,
  ConfigTypes,
  FabSettings,
} from '@fab/core'

import { log } from './utils'
import path from 'path'
import nanoid from 'nanoid'
import fs from 'fs-extra'
import { extract } from 'zip-lib'

export const createPackage: FabPackager<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  log.time(`Compiling package to: 💛${fab_path}💛:`)
  const output_dir = path.dirname(package_path)
  const work_dir = path.join(output_dir, `cf-workers-${nanoid()}`)
  await fs.ensureDir(work_dir)
  log(`💚✔💚 Generated working dir in 💛${work_dir}💛`)
  await extract(fab_path, work_dir)
  log(`💚✔💚 Unpacked FAB!`)
}
