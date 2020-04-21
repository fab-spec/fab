import {
  ConfigTypes,
  FabAssetsDeployer,
  FabDeployer,
  FabServerDeployer,
  FabSettings,
} from '@fab/core'
import { CloudflareApi, getCloudflareApi, log } from './utils'
import { FabDeployError, InvalidConfigError } from '@fab/cli'
import { createPackage } from './createPackage'
import path from 'path'
import fs from 'fs-extra'

const notImplemented = () => {
  throw new Error(`Not implemented!
  The CF releaser currently only supports the server component.
  Please use @fab/deployer-aws-s3 to host assets instead.`)
}

export const deployBoth: FabDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings
) => notImplemented()

export const deployAssets: FabAssetsDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers
) => notImplemented()

async function getApi(api_token: string) {
  log(`💚✔💚 Config valid, checking API token...`)
  const api = await getCloudflareApi(api_token)
  return api
}

async function packageAndUpload(
  fab_path: string,
  package_path: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string,
  api: CloudflareApi,
  account_id: string,
  script_name: string
) {
  log(`💚✔💚 API token valid, packaging...`)
  await createPackage(fab_path, package_path, config, env_overrides, assets_url)

  log.time(`Uploading script...`)
  const upload_response = await api.putJS(
    `/accounts/${account_id}/workers/scripts/${script_name}`,
    {
      body: await fs.readFile(package_path, 'utf8'),
    }
  )
  if (!upload_response.success) {
    throw new FabDeployError(`Error uploading the script, got response:
    ❤️${JSON.stringify(upload_response)}❤️`)
  }
  log(`💚✔💚 Uploaded, publishing...`)
}

export const deployServer: FabServerDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  const package_path = path.join(working_dir, 'cf-workers.js')

  log(`Starting deploy...`)

  if (!assets_url) {
    throw new FabDeployError(
      `Cloudflare Workers requires an assets_url, while KV is still not supported.`
    )
  }

  const { account_id, zone_id, route, api_token, workers_dev, script_name } = config

  if (!workers_dev) {
    checkValidityForZoneRoutes(config)

    const api = await getApi(api_token)
    await packageAndUpload(
      fab_path,
      package_path,
      config,
      env_overrides,
      assets_url,
      api,
      account_id,
      script_name
    )

    const list_routes_response = await api.get(`/zones/${zone_id}/workers/routes`)
    if (!list_routes_response.success) {
      throw new FabDeployError(`Error listing routes on zone 💛${zone_id}💛:
      ❤️${JSON.stringify(list_routes_response)}❤️`)
    }

    const existing_route = list_routes_response.result.find(
      (r: any) => r.pattern === route
    )
    if (existing_route) {
      const { id, script } = existing_route
      if (script === script_name) {
        log(
          `💚Route already exists!💚: pattern 💛${route}💛 already points at script 💛${script_name}💛`
        )
      } else {
        log(`Found existing route id 💛${id}💛, updating...`)
        const update_route_response = await api.putJSON(
          `/zones/${zone_id}/workers/routes/${id}`,
          {
            body: JSON.stringify({ pattern: route, script: script_name }),
          }
        )
        if (!update_route_response.success) {
          throw new FabDeployError(`Error publishing to route 💛${route}💛 on zone 💛${zone_id}💛:
        ❤️${JSON.stringify(update_route_response)}❤️`)
        }
      }
    } else {
      const create_route_reponse = await api.post(`/zones/${zone_id}/workers/routes`, {
        body: JSON.stringify({ pattern: route, script: script_name }),
      })
      if (!create_route_reponse.success) {
        throw new FabDeployError(`Error publishing to route 💛${route}💛 on zone 💛${zone_id}💛:
      ❤️${JSON.stringify(create_route_reponse)}❤️`)
      }
    }
    log(`💚✔💚 Done.`)
    log.time((d) => `Deployed in ${d}.`)

    return new URL(route).origin
  } else {
    checkValidityForWorkersDev(config)

    const api = await getApi(api_token)
    await packageAndUpload(
      fab_path,
      package_path,
      config,
      env_overrides,
      assets_url,
      api,
      account_id,
      script_name
    )

    const subdomain_response = await api.get(`/accounts/${account_id}/workers/subdomain`)
    if (!subdomain_response.success) {
      throw new FabDeployError(`Error getting your workers.dev subdomain:
      ❤️${JSON.stringify(subdomain_response)}❤️`)
    }
    const { subdomain } = subdomain_response.result

    const publish_response = await api.post(
      `/accounts/${account_id}/workers/scripts/${script_name}/subdomain`,
      {
        body: JSON.stringify({ enabled: true }),
      }
    )
    if (!publish_response.success) {
      throw new FabDeployError(`Error publishing the script on a workers.dev subdomain, got response:
      ❤️${JSON.stringify(publish_response)}❤️`)
    }
    log(`💚✔💚 Done.`)
    log.time((d) => `Deployed in ${d}.`)

    return `https://${script_name}.${subdomain}.workers.dev`
  }
}

function checkValidityForWorkersDev(config: ConfigTypes.CFWorkers) {
  const required_keys: Array<keyof ConfigTypes.CFWorkers> = [
    'account_id',
    'api_token',
    'script_name',
  ]
  const missing_config = required_keys.filter((k) => !config[k])
  if (missing_config.length > 0) {
    throw new InvalidConfigError(`Missing required keys for @fab/deploy-cf-workers (with 💛workers_dev: true💛):
    ${missing_config.map((k) => `💛• ${k}💛`).join('\n')}`)
  }
  const ignored_keys: Array<keyof ConfigTypes.CFWorkers> = ['zone_id', 'route']
  const ignored_config = ignored_keys.filter((k) => config[k])
  if (ignored_config.length > 0) {
    log(`💚NOTE:💚 ignoring the following config as deploys with 💛workers_dev: true💛 don't need them:
      ${ignored_config.map((k) => `💛• ${k}: ${config[k]}💛`).join('\n')}`)
  }
}

function checkValidityForZoneRoutes(config: ConfigTypes.CFWorkers) {
  const required_keys: Array<keyof ConfigTypes.CFWorkers> = [
    'account_id',
    'api_token',
    'script_name',
    'zone_id',
    'route',
  ]
  const missing_config = required_keys.filter((k) => !config[k])
  if (missing_config.length > 0) {
    throw new InvalidConfigError(`Missing required keys for @fab/deploy-cf-workers (with 💛workers_dev: false💛):
    ${missing_config.map((k) => `💛• ${k}💛`).join('\n')}`)
  }
}
