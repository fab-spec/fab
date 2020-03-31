import { FabPackager, ConfigTypes } from '@fab/core'
import { DEFAULT_ASSET_SETTINGS } from './constants'
import fs from 'fs-extra'
import path from 'path'
import nanoid from 'nanoid'
// @ts-ignore
import decompress from '@atomic-reactor/decompress'
import execa from 'execa'
import { Zip } from 'zip-lib'

export const createPackage: FabPackager<ConfigTypes.AwsLambda> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.AwsLambda,
  assets_url: string
) => {
  console.log('BOY I GON GIT')
  const asset_settings = {
    ...DEFAULT_ASSET_SETTINGS,
    // todo: parameterise asset settings?
  }
  const env_settings = {
    // todo: should I read this from config or have it passed in maybe?
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

  // await fixServerPath(work_dir)
  await fs.writeFile(
    path.join(work_dir, 'asset_settings.js'),
    `
    module.exports = ${JSON.stringify(asset_settings)};
  `
  )
  console.log('WROTE ASSET SETTINGS')

  await fs.writeFile(
    path.join(work_dir, 'env_settings.js'),
    `
    module.exports = ${JSON.stringify(env_settings)};
  `
  )
  console.log('WROTE ENV SETTINGS')

  // await copyIndex(work_dir)
  const packaged = new Zip()
  packaged.addFile(path.join(work_dir, 'index.js'), 'index.js')
  packaged.addFile(path.join(work_dir, 'asset_settings.js'), 'asset_settings.js')
  packaged.addFile(path.join(work_dir, 'env_settings.js'), 'env_settings.js')
  packaged.addFile(path.join(work_dir, 'server.js'), 'server.js')
  packaged.addFolder(path.join(work_dir, 'node_modules'), 'node_modules')
  await packaged.archive(package_path)

  // await zipAssets(output_dir, work_dir)

  // await fs.remove(work_dir)
  console.log(`All done.`)
}
