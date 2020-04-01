import { ConfigTypes, FabPackager, FabSettings } from '@fab/core'
import { DEFAULT_ASSET_SETTINGS } from './constants'
import fs from 'fs-extra'
import path from 'path'
import nanoid from 'nanoid'
// @ts-ignore
import decompress from '@atomic-reactor/decompress'
import execa from 'execa'
import { Zip } from 'zip-lib'
import { log } from './utils'

export const createPackage: FabPackager<ConfigTypes.AwsLambda> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.AwsLambda,
  env_overrides: FabSettings,
  assets_url: string
) => {
  log.time(`Compiling package to: 💛${fab_path}💛:`)
  const asset_settings = {
    ...DEFAULT_ASSET_SETTINGS,
    // todo: parameterise asset settings?
  }
  const output_dir = path.dirname(package_path)
  const work_dir = path.join(output_dir, `aws-lambda-${nanoid()}`)
  await fs.ensureDir(work_dir)
  log.continue(`💚✔💚 Generated working dir in 💛${work_dir}💛`)
  await decompress(fab_path, work_dir, { followSymlinks: true })
  log.continue(`💚✔💚 Unpacked FAB`)
  await fs.copy(path.join(__dirname, '../templates'), work_dir)
  log.continue(`💚✔💚 Copied AWS Lambda shim`)
  await execa('npm', ['install'], { cwd: work_dir })
  log.continue(`💚✔💚 Installed dependencies`)

  // await fixServerPath(work_dir)
  await fs.writeFile(
    path.join(work_dir, 'asset_settings.js'),
    `
      module.exports = ${JSON.stringify(asset_settings)};
    `
  )

  await fs.writeFile(
    path.join(work_dir, 'env_settings.js'),
    `
      module.exports = ${JSON.stringify(env_overrides)};
    `
  )

  // await copyIndex(work_dir)
  const packaged = new Zip()
  packaged.addFile(path.join(work_dir, 'index.js'), 'index.js')
  packaged.addFile(path.join(work_dir, 'asset_settings.js'), 'asset_settings.js')
  packaged.addFile(path.join(work_dir, 'env_settings.js'), 'env_settings.js')
  packaged.addFile(path.join(work_dir, 'server.js'), 'server.js')
  packaged.addFolder(path.join(work_dir, 'node_modules'), 'node_modules')
  await packaged.archive(package_path)
  log.continue(`💚✔💚 Generated lambda zip file`)
  log.time((d) => `Created package in ${d}.`)
}
