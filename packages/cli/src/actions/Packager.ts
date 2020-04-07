import {
  HOSTING_PROVIDERS,
  FabPackagerExports,
  ConfigTypes,
  FabConfig,
  DeployProviders,
} from '@fab/core'
import { _log, loadModule } from '../helpers'
import { FabPackageError } from '../errors'
const log = _log(`Packager`)

export default class Packager {
  static async package(
    file_path: string,
    config: FabConfig,
    target: DeployProviders,
    output_path: string | undefined,
    assets_url: string,
    env: string | undefined
  ) {
    log(`💎 💚fab package💚 💎\n`)
    const provider = HOSTING_PROVIDERS[target]
    if (!provider) {
      throw new FabPackageError(
        `Target '${target}' not supported.
        Needs to be one of ${Object.keys(HOSTING_PROVIDERS).join(', ')}`
      )
    }
    if (!output_path) output_path = `.fab/deploy/${target}.${provider.extension}`

    const { package_name } = provider
    log(`Loading packager code from ${package_name}`)
    const packager = loadModule(package_name, [process.cwd()]) as FabPackagerExports<
      ConfigTypes.Union
    >
    log(`💚✔💚 Done.`)

    if (env) throw new Error('Not implemented ENV support yet')
    const env_overrides = {}

    const deploy_config = config.deploy![target] as ConfigTypes.Union
    await packager.createPackage(
      file_path,
      output_path,
      deploy_config,
      env_overrides,
      assets_url
    )
  }
}