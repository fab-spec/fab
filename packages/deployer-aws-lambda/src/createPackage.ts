import { ConfigTypes, FabPackager, FabSettings, stripTrailingSlash } from '@fab/core'
import fs from 'fs-extra'
import path from 'path'
import nanoid from 'nanoid'
import { Zip, extract } from 'zip-lib'
import { log } from './utils'
import { pathToSHA512 } from 'file-to-sha512'

export const createPackage: FabPackager<ConfigTypes.AwsLambda> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.AwsLambda,
  env_overrides: FabSettings,
  assets_url: string
) => {
  log.time(`Compiling package to: 💛${package_path}💛:`)
  const output_dir = path.dirname(package_path)
  const work_dir = path.join(output_dir, `aws-lambda-${nanoid()}`)
  await fs.ensureDir(work_dir)
  log.tick(`Generated working dir in 💛${work_dir}💛`)
  await extract(fab_path, work_dir)
  log.tick(`Unpacked FAB`)

  const bundle_id = (await pathToSHA512(fab_path)).slice(0, 32)

  await fs.copy(path.join(__dirname, '../templates'), work_dir)
  log.tick(`Copied AWS Lambda shim`)

  const parsed = new URL(assets_url)
  const packaged_config = {
    env_overrides,
    assets_url: stripTrailingSlash(assets_url),
    assets_domain: parsed.hostname,
    assets_path_prefix: stripTrailingSlash(parsed.pathname),
    bundle_id,
  }

  await fs.writeFile(
    path.join(work_dir, 'packaged_config.js'),
    `module.exports = ${JSON.stringify(packaged_config)};`
  )
  log.tick(`Generated PACKAGED_CONFIG file`)

  // await copyIndex(work_dir)
  const packaged = new Zip()
  packaged.addFile(path.join(work_dir, 'index.js'), 'index.js')
  packaged.addFile(path.join(work_dir, 'packaged_config.js'), 'packaged_config.js')
  packaged.addFile(path.join(work_dir, 'server.js'), 'server.js')
  packaged.addFolder(path.join(work_dir, 'vendor'), 'vendor')
  await packaged.archive(package_path)
  log.tick(`Generated lambda zip file`)
  log.time((d) => `Created package in ${d}.`)
}
