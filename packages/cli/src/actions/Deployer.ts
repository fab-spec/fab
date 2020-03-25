import { FabConfig, HOSTING_PROVIDERS, DeployConfig } from '@fab/core'
import JSON5Config from '../helpers/JSON5Config'
import { FabDeployError, InvalidConfigError } from '../errors'

export default class Deployer {
  static async deploy(
    config: JSON5Config,
    file_path: string,
    output_path: string | undefined,
    server_host: string | undefined,
    assets_host: string | undefined
  ) {
    const { deploy } = config.data

    if (!deploy)
      throw new FabDeployError(
        `For the moment, you need to have your fab.config.json5 "deploy" section configured.
        See https://fab.dev/kb/deploying for more information.
        `
      )

    const { server_provider, assets_provider } = this.getProviders(
      deploy,
      server_host,
      assets_host
    )
    console.log({ server_provider, assets_provider })
  }

  private static getProviders(
    deploy: DeployConfig,
    server_host: string | undefined,
    assets_host: string | undefined
  ) {
    const targets = Object.keys(deploy)

    const assets_only_hosts = []
    const server_only_hosts = []
    const versatile_hosts = []

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
    )
    const assets_provider = this.resolveProvider(
      deploy,
      'assets',
      assets_host,
      assets_only_hosts,
      versatile_hosts
    )

    return { server_provider, assets_provider }
  }

  private static resolveProvider(
    deploy: DeployConfig,
    type: string,
    hard_coded: string | undefined,
    specific_hosts: string[],
    versatile_hosts: string[]
  ) {
    if (hard_coded) {
      const provider = deploy[hard_coded]
      if (provider) return provider
      throw new InvalidConfigError(
        `Your specified ${type} host '${hard_coded}' does not exist in your fab.config.json5 deploy config.`
      )
    }

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
}
