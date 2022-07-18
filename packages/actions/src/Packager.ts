import {
  ConfigTypes,
  DeployProviders,
  FabConfig,
  FabPackagerExports,
  HOSTING_PROVIDERS,
  PackageFn,
} from '@dev-spendesk/fab-core'
import { _log, FabPackageError, loadModule } from '@dev-spendesk/fab-cli'

const log = _log(`Packager`)

function isFabPackagerExports(p: any): p is FabPackagerExports<ConfigTypes.Union> {
  return p.createPackage
}

export default class Packager {
  static package: PackageFn = async (
    file_path: string,
    config: FabConfig,
    target: DeployProviders,
    output_path: string | undefined,
    assets_url: string,
    env: string | undefined
  ) => {
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
    const packager = loadModule(log, package_name)
    log.tick(`Done.`)

    if (!isFabPackagerExports(packager)) {
      throw new FabPackageError(
        `Error: module 💛${package_name}💛 can't create a package.
        This could be because this module is only for deploying static assets, not server components.
        Packaging is only relevant to the server component.
        See 🖤https://fab.dev/kb/deploying🖤 for more information.`
      )
    }

    if (env) throw new Error('Not implemented ENV support yet')
    const env_overrides = new Map()

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
