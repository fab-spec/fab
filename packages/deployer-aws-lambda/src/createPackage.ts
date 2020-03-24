import { FabPackager } from '@fab/core/src'
import { DEFAULT_ASSET_SETTINGS } from './constants'
import fs from 'fs-extra'
import path from 'path'
import nanoid from 'nanoid'

export const createPackage: FabPackager = async (
  fab_path: string,
  package_path: string
) => {
  const asset_settings = {
    ...DEFAULT_ASSET_SETTINGS,
    // todo: parameterise asset settings?
  }

  const output_dir = path.dirname(package_path)
  const work_dir = path.join(output_dir, `aws-lambda-${nanoid()}`)
  // await fs.ensureDir(output_dir)
  // await unzip_fab(fab_file, work_dir)
  // await installNodeFetch(work_dir)
  // await fixServerPath(work_dir)
  // await writeAssetSettings(work_dir, asset_settings)
  // await writeEnvSettings(work_dir, env_settings)
  // await copyIndex(work_dir)
  // await zipLambda(output_dir, work_dir)
  // await zipAssets(output_dir, work_dir)
  // await rimraf(work_dir, { glob: { cwd: output_dir } })
}
