import {
  FabDeployerExports,
  FabSettings,
  ENV_VAR_SYNTAX,
  HOSTING_PROVIDERS,
  DeployConfig,
  DeployProviders,
} from '@fab/core'
import JSON5Config from '../helpers/JSON5Config'
import { FabDeployError, InvalidConfigError } from '../errors'
import { _log, loadModule } from '../helpers'
import fs from 'fs-extra'

const log = _log('fab deploy')

export default class Deployer {
  static async deploy(
    config: JSON5Config,
    file_path: string,
    package_dir: string,
    server_host: DeployProviders | undefined,
    assets_host: DeployProviders | undefined
  ) {
    const { deploy } = config.data

    if (!deploy) {
      throw new FabDeployError(
        `For the moment, you need to have your fab.config.json5 "deploy" section configured.
        See https://fab.dev/kb/deploying for more information.
        `
      )
    }

    const { server_provider, assets_provider } = this.getProviders(
      deploy,
      server_host,
      assets_host
    )
    log(`Creating package directory 💛${package_dir}💛:`)
    await fs.ensureDir(package_dir)
    log(`💚✔💚 Done.`)

    const assets_package = HOSTING_PROVIDERS[assets_provider].package_name
    const assets_deployer = loadModule(assets_package, [
      process.cwd(),
    ]) as FabDeployerExports<any>
    if (server_provider === assets_provider) {
      if (typeof assets_deployer.deployBoth !== 'function') {
        throw new FabDeployError(
          `${assets_package} doesn't export a 'deployBoth' method!`
        )
      }
      return assets_deployer.deployBoth(file_path, package_dir, deploy[assets_provider])
    }

    if (typeof assets_deployer.deployAssets !== 'function') {
      throw new FabDeployError(
        `${assets_package} doesn't export a 'deployAssets' method!`
      )
    }

    const server_package = HOSTING_PROVIDERS[server_provider].package_name
    const server_deployer = loadModule(server_package, [
      process.cwd(),
    ]) as FabDeployerExports<any>

    if (typeof server_deployer.deployServer !== 'function') {
      throw new FabDeployError(
        `${server_package} doesn't export a 'deployServer' method!`
      )
    }

    const assets_url = await assets_deployer.deployAssets(
      file_path,
      package_dir,
      this.resolveEnvVars(deploy[assets_provider]!)
    )

    console.log({ assets_url })

    const server_url = await server_deployer.deployServer(
      file_path,
      package_dir,
      this.resolveEnvVars(deploy[server_provider]!),
      assets_url
    )
    console.log({ server_url })

    return 'LOL'
  }

  private static getProviders(
    deploy: DeployConfig,
    server_host: DeployProviders | undefined,
    assets_host: DeployProviders | undefined
  ): {
    server_provider: DeployProviders
    assets_provider: DeployProviders
  } {
    const targets = Object.keys(deploy) as DeployProviders[]

    const assets_only_hosts: DeployProviders[] = []
    const server_only_hosts: DeployProviders[] = []
    const versatile_hosts: DeployProviders[] = []

    for (const target of targets) {
      const provider = HOSTING_PROVIDERS[target]

      if (!provider) {
        throw new FabDeployError(
          `Deploy target '${target}' in your fab.config.json5 not supported.
          Needs to be one of ${Object.keys(HOSTING_PROVIDERS).join(', ')}`
        )
      }

      if (provider.capabilities.server) {
        if (provider.capabilities.assets) {
          versatile_hosts.push(target)
        } else {
          server_only_hosts.push(target)
        }
      } else {
        if (provider.capabilities.assets) {
          assets_only_hosts.push(target)
        } else {
          throw new FabDeployError(
            `Deploy target '${target}' doesn't host the server or the assets, what is it for?`
          )
        }
      }
    }

    const server_provider = this.resolveProvider(
      deploy,
      'server',
      server_host,
      server_only_hosts,
      versatile_hosts
    ) as DeployProviders
    const assets_provider = this.resolveProvider(
      deploy,
      'assets',
      assets_host,
      assets_only_hosts,
      versatile_hosts
    ) as DeployProviders

    return { server_provider, assets_provider }
  }

  private static resolveProvider(
    deploy: DeployConfig,
    type: string,
    hard_coded: DeployProviders | undefined,
    specific_hosts: DeployProviders[],
    versatile_hosts: DeployProviders[]
  ): string {
    if (hard_coded) {
      const provider = deploy[hard_coded]
      if (provider) return hard_coded
      throw new InvalidConfigError(
        `Your specified ${type} host '${hard_coded}' does not exist in your fab.config.json5 deploy config.`
      )
    }
    const chosen_provider = this.chooseProviderAutomatically(
      specific_hosts,
      type,
      versatile_hosts
    )

    const rejected_providers = [...specific_hosts, versatile_hosts].filter(
      (s) => s !== chosen_provider
    )
    log(`Deploying 💛${type}💛 with ${chosen_provider}.`)
    if (rejected_providers.length > 0)
      log.continue(
        `Also found the following ${type}-compatible hosts configured:
        🖤${rejected_providers.join('\n')}🖤`
      )
    log.continue(`Use the 💛--${type}-host💛 to override this.\n`)

    return chosen_provider
  }

  private static chooseProviderAutomatically(
    specific_hosts: string[],
    type: string,
    versatile_hosts: string[]
  ) {
    if (specific_hosts.length === 1) {
      return specific_hosts[0]
    }
    if (specific_hosts.length > 1) {
      throw new InvalidConfigError(
        `Your fab.config.json5 deploy config has multiple ${type}-only hosts: ${specific_hosts.join(
          ', '
        )}
        Choose one with the --${type}-host argument`
      )
    }

    if (versatile_hosts.length === 1) {
      return versatile_hosts[0]
    }
    if (versatile_hosts.length > 1) {
      throw new InvalidConfigError(
        `Your fab.config.json5 deploy config has multiple hosts capable of both server & asset hosting: ${specific_hosts.join(
          ', '
        )}
        Specify which one to use with the --server-host & --assets-host arguments`
      )
    }

    throw new InvalidConfigError(
      `Your fab.config.json5 deploy config has no entries for hosts capable of hosting your ${type}.
      See https://fab.dev/kb/deploying for more information.`
    )
  }

  private static resolveEnvVars(config: FabSettings) {
    const result: FabSettings = {}
    const missing_env_vars: string[] = []
    for (const [k, v] of Object.entries(config)) {
      if (typeof v === 'string' && v.match(ENV_VAR_SYNTAX)) {
        const env_var = v.slice(1)
        const value = process.env[env_var]
        if (typeof value === 'undefined') {
          missing_env_vars.push(env_var)
        } else {
          result[k] = value
        }
      } else {
        result[k] = v
      }
    }
    if (missing_env_vars.length > 0) {
      throw new InvalidConfigError(
        `Your deploy config references environment variables that weren't found:
        ${missing_env_vars.map((e) => `• 💛${e}💛`).join('\n')}`
      )
    }
    return result
  }
}
