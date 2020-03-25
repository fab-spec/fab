import { HOSTING_PROVIDERS, FabPackager } from '@fab/core'
import fs from 'fs-extra'
import path from 'path'
import { _log, loadModule } from '../helpers'
import { FabPackageError } from '../errors'
const log = _log(`[🖤FAB:Package🖤] `)

export default class Packager {
  static async package(
    file_path: string,
    target: string,
    output_path: string = `.fab/deploy/${target}.zip`
  ) {
    const provider = HOSTING_PROVIDERS[target]
    if (!provider) {
      throw new FabPackageError(
        `Target '${target}' not supported.
        Needs to be one of ${Object.keys(HOSTING_PROVIDERS).join(', ')}`
      )
    }

    const { package_name } = provider
    log(`Loading packager code from ${package_name}`)
    const packager = loadModule(package_name, [process.cwd()]) as {
      createPackage: FabPackager
    }
    log(`💚✔💚 Done.`)

    const package_dir = path.dirname(output_path)
    log(`Creating package directory 💛${package_dir}💛:`)
    await fs.ensureDir(package_dir)
    log(`💚✔💚 Done.`)

    await packager.createPackage(file_path, output_path)
  }
}
