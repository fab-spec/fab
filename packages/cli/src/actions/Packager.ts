import { HOSTING_PROVIDERS, FabPackagerExports, FabPackagerConfig } from '@fab/core'
import { _log, loadModule } from '../helpers'
import { FabPackageError } from '../errors'
const log = _log(`fab package`)

export default class Packager {
  static async package(
    file_path: string,
    target: string,
    output_path: string = `.fab/deploy/${target}.zip`,
    assets_url: string | undefined
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
    const packager = loadModule(package_name, [process.cwd()]) as FabPackagerExports<
      FabPackagerConfig
    >
    log(`💚✔💚 Done.`)

    await packager.createPackage(file_path, output_path, { assets_url })
  }
}
