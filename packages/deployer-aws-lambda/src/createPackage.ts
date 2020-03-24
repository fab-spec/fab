import { FabPackager } from '@fab/core/src'
import { DEFAULT_ASSET_SETTINGS } from './constants'
import fs from 'fs-extra'
import path from 'path'
import nanoid from 'nanoid'
// @ts-ignore
import decompress from '@atomic-reactor/decompress'
import execa from 'execa'

export const createPackage: FabPackager = async (
  fab_path: string,
  package_path: string
) => {
  console.log('BOY I GON GIT')
  const asset_settings = {
    ...DEFAULT_ASSET_SETTINGS,
    // todo: parameterise asset settings?
  }

  const output_dir = path.dirname(package_path)
  console.log({ output_dir })
  const work_dir = path.join(output_dir, `aws-lambda-${nanoid()}`)
  console.log({ work_dir })
  await fs.ensureDir(work_dir)
  console.log('GOT ME A DIR')
  await decompress(fab_path, work_dir, { followSymlinks: true })
  console.log('DECOMPRESS YO')
  await fs.copy(path.join(__dirname, '../templates'), work_dir)
  console.log('COPY BOIII')
  await execa('npm', ['install'], { cwd: work_dir })
  console.log('NPMMMMMED')

  // await installNodeFetch(work_dir)
  // await fixServerPath(work_dir)
  // await writeAssetSettings(work_dir, asset_settings)
  // await writeEnvSettings(work_dir, env_settings)
  // await copyIndex(work_dir)
  // await zipLambda(output_dir, work_dir)
  // await zipAssets(output_dir, work_dir)
  // await rimraf(work_dir, { glob: { cwd: output_dir } })
}
