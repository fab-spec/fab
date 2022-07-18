import fs from 'fs-extra'
import {
  DeployConfig,
  DeployProviders,
  ENV_VAR_SYNTAX,
  FabDeployerExports,
  FabSettings,
  HOSTING_PROVIDERS,
} from '@dev-spendesk/fab-core'
import {
  _log,
  FabDeployError,
  InvalidConfigError,
  JSON5Config,
  loadOrInstallModule,
  loadOrInstallModules,
} from '@dev-spendesk/fab-cli'

const log = _log('Deployer')

export default class Deployer {
  private static auto_install: boolean

  static async deploy(
    config: JSON5Config,
    file_path: string,
    package_dir: string,
    server_host: DeployProviders | undefined,
    assets_host: DeployProviders | undefined,
    envs: string[] | undefined,
    assets_only: boolean,
    assets_already_deployed_at: string | undefined,
    auto_install: boolean
  ) {
    this.auto_install = auto_install

    log(`💎 💚fab deployer💚 💎\n`)
    const { deploy } = config.data

    if (!deploy) {
      throw new FabDeployError(
        `For the moment, you need to have your fab.config.json5 "deploy" section configured.
        See https://fab.dev/guides/deploying for more information.
        `
      )
    }
    const env_overrides = await this.getSettingsOverrides(config, envs)

    const { server_provider, assets_provider } = this.getProviders(
      deploy,
      server_host,
      assets_host,
      !!assets_already_deployed_at
    )
    log(`Creating package directory 💛${package_dir}💛:`)
    await fs.ensureDir(package_dir)
    log.tick(`Done.`)

    if (assets_provider) {
      const deployed_url = await this.deployAssetsAndServer(
        file_path,
        package_dir,
        deploy,
        env_overrides,
        assets_provider,
        server_provider,
        assets_only
      )
      log(`💚SUCCESS💚: Deployed to 💛${deployed_url}💛`)
      return deployed_url
    } else {
      log(
        `💚NOTE:💚 skipping assets deploy, using 💛${assets_already_deployed_at}💛 for assets URL.`
      )

      const server_deployer = await this.loadPackage<FabDeployerExports<any>>(
        server_provider,
        'deployServer'
      )

      const deployed_url = await this.deployServer(
        server_deployer,
        file_path,
        package_dir,
        this.resolveEnvVars(deploy[server_provider]!),
        env_overrides,
        assets_already_deployed_at!
      )
      log(`💚SUCCESS💚: Deployed to 💛${deployed_url}💛`)
      return deployed_url
    }
  }

  // TODO: this should be common somewhere
  private static async getSettingsOverrides(
    config: JSON5Config,
    envs?: string[]
  ): Promise<Map<string, FabSettings>> {
    const env_overrides = new Map()

    if (!envs) {
      return new Map([['production', {}]])
    }

    for (const env of envs) {
      const overrides = config.data.settings?.[env]
      if (!overrides) {
        throw new InvalidConfigError(`No environment '${env}' found in ${config}!`)
      }
      env_overrides.set(env, overrides)
    }

    return env_overrides
  }

  private static async deployAssetsAndServer(
    file_path: string,
    package_dir: string,
    deploy: DeployConfig,
    env_overrides: Map<string, FabSettings>,
    assets_provider: DeployProviders,
    server_provider: DeployProviders,
    assets_only: boolean
  ) {
    if (server_provider === assets_provider) {
      const deployer = await this.loadPackage<FabDeployerExports<any>>(
        assets_provider,
        'deployBoth'
      )

      return deployer.deployBoth!(
        file_path,
        package_dir,
        this.resolveEnvVars(deploy[assets_provider]!),
        env_overrides
      )
    }

    const [assets_deployer, server_deployer] = await this.loadTwoPackages<
      FabDeployerExports<any>,
      FabDeployerExports<any>
    >(assets_provider, 'deployAssets', server_provider, 'deployServer')

    const assets_url = await assets_deployer.deployAssets!(
      file_path,
      package_dir,
      this.resolveEnvVars(deploy[assets_provider]!)
    )

    log(`Assets deployed at 💛${assets_url}💛`)

    if (assets_only) return assets_url

    return await this.deployServer(
      server_deployer,
      file_path,
      package_dir,
      this.resolveEnvVars(deploy[server_provider]!),
      env_overrides,
      assets_url
    )
  }

  private static async loadPackage<T>(provider: string, fn: string): Promise<T> {
    const pkg = HOSTING_PROVIDERS[provider].package_name
    const loaded = await loadOrInstallModule(log, pkg, this.auto_install)

    if (typeof loaded[fn] !== 'function') {
      throw new FabDeployError(`${pkg} doesn't export a '${fn}' method!`)
    }

    return loaded as T
  }

  private static async loadTwoPackages<T, U>(
    providerA: string,
    fnA: string,
    providerB: string,
    fnB: string
  ): Promise<[T, U]> {
    const pkgA = HOSTING_PROVIDERS[providerA].package_name
    const pkgB = HOSTING_PROVIDERS[providerB].package_name
    const [loadedA, loadedB] = await loadOrInstallModules(
      log,
      [pkgA, pkgB],
      this.auto_install
    )

    if (typeof loadedA[fnA] !== 'function') {
      throw new FabDeployError(`${pkgA} doesn't export a '${fnA}' method!`)
    }
    if (typeof loadedB[fnB] !== 'function') {
      throw new FabDeployError(`${pkgB} doesn't export a '${fnB}' method!`)
    }

    return [loadedA as T, loadedB as U]
  }

  private static async deployServer(
    server_deployer: FabDeployerExports<any>,
    file_path: string,
    package_dir: string,
    config: FabSettings,
    env_overrides: Map<string, FabSettings>,
    assets_url: string
  ) {
    return await server_deployer.deployServer!(
      file_path,
      package_dir,
      config,
      env_overrides,
      assets_url
    )
  }

  private static getProviders(
    deploy: DeployConfig,
    server_host: DeployProviders | undefined,
    assets_host: DeployProviders | undefined,
    skip_assets: boolean
  ): {
    server_provider: DeployProviders
    assets_provider?: DeployProviders
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

    if (skip_assets) return { server_provider }

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

    const rejected_providers = [...specific_hosts, ...versatile_hosts].filter(
      (s) => s !== chosen_provider
    )
    log(`Deploying 💛${type}💛 with ${chosen_provider}.`)
    if (rejected_providers.length > 0)
      log(
        `Also found the following ${type}-compatible hosts configured:
        🖤${rejected_providers.join('\n')}🖤`
      )
    log(`Use the 💛--${type}-host💛 argument to override this.\n`)

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
      See https://fab.dev/guides/deploying for more information.`
    )
  }

  private static resolveEnvVars(config: FabSettings) {
    const result: FabSettings = {}
    const missing_env_vars: string[] = []
    for (const [k, v] of Object.entries(config)) {
      const match = typeof v === 'string' && v.match(ENV_VAR_SYNTAX)
      if (match) {
        const [_, env_var] = match
        if (!env_var) {
          log(
            `❤️WARNING:❤️ config value 💛${v}💛 looks like an environment variable but doesn't match pattern 💛${ENV_VAR_SYNTAX}💛`
          )
        }
        const value = process.env[env_var]
        if (typeof value === 'undefined' || value === '') {
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
