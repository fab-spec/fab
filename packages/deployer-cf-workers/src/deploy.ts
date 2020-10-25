import {
  ConfigTypes,
  FabAssetsDeployer,
  FabDeployer,
  FabServerDeployer,
  FabSettings,
  getContentType,
} from '@fab/core'
import { CloudflareApi, getCloudflareApi, log } from './utils'
import { FabDeployError, InvalidConfigError } from '@fab/cli'
import { createPackage } from './createPackage'
import path from 'path'
import fs from 'fs-extra'
import nanoid from 'nanoid'
import { extract } from 'zip-lib'
import globby from 'globby'
import pretty from 'pretty-bytes'
import Multipart from 'form-data'

export const deployBoth: FabDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_dir: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings
) => {
  const assets_url = await deployAssets(fab_path, package_dir, config)
  return await deployServer(fab_path, package_dir, config, env_overrides, assets_url)
}

export const deployAssets: FabAssetsDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_dir: string,
  config: ConfigTypes.CFWorkers
) => {
  log(`Starting 💛assets💛 deploy...`)

  const { account_id, api_token, script_name } = config
  log.tick(`Config valid, checking API token...`)
  const asset_namespace = `FAB assets (${script_name})`

  const extracted_dir = path.join(package_dir, `cf-workers-${nanoid()}`)
  await fs.ensureDir(extracted_dir)
  log.tick(`Generated working dir in 💛${extracted_dir}💛.`)
  await extract(fab_path, extracted_dir)
  log.tick(`Unpacked FAB.`)

  log(`Uploading assets to KV store...`)
  const api = await getCloudflareApi(api_token, account_id)
  if (!api.account_supports_kv) {
    throw new InvalidConfigError(`Cannot deploy assets to Cloudflare Workers without KV store access.
    Use an alternate asset host e.g. AWS S3
    🖤  (see https://fab.dev/guides/deploying for more info)🖤
    or upgrade your Cloudflare account.`)
  }

  const namespace = await api.getOrCreateNamespace(asset_namespace)

  log(`Uploading files...`)
  const files = await globby(['_assets/**/*'], { cwd: extracted_dir })
  const uploads = files.map(async (file) => {
    const content_type = getContentType(file)
    const body_stream = fs.createReadStream(path.join(extracted_dir, file))

    const body = new Multipart()
    body.append('metadata', JSON.stringify({ content_type }), {
      contentType: 'application/json',
    })
    body.append('value', body_stream)

    const response = await api.put(
      `/accounts/${account_id}/storage/kv/namespaces/${
        namespace.id
      }/values/${encodeURIComponent(`/${file}`)}`,
      {
        body: (body as unknown) as FormData,
        headers: body.getHeaders(),
      }
    )
    if (!response.success) {
      throw new FabDeployError(`❤️Error uploading file❤️ 💛${file}💛:
        ${response.errors
          .map((err: any) => `🖤[error ${err.code}]🖤 ❤️${err.message}❤️`)
          .join('\n')}
      `)
    }

    log.continue(`🖤  ${file} (${pretty(body_stream.bytesRead)})🖤`)
  })

  log.tick(`Done.`)

  await Promise.all(uploads)

  return `kv://${namespace.id}`
}

export const deployServer: FabServerDeployer<ConfigTypes.CFWorkers> = async (
  fab_path: string,
  package_dir: string,
  config: ConfigTypes.CFWorkers,
  env_overrides: FabSettings,
  assets_url: string
) => {
  const package_path = path.join(package_dir, 'cf-workers.js')

  log(`Starting 💛server💛 deploy...`)

  if (!assets_url) {
    throw new FabDeployError(
      `Cloudflare Workers requires an assets_url, while KV is still not supported.`
    )
  }

  const { account_id, zone_id, route, routes, api_token, workers_dev, script_name } = config

  if (workers_dev) {
    checkValidityForWorkersDev(config)
  } else {
    checkValidityForZoneRoutes(config)
  }
  const api = await getCloudflareApi(api_token, account_id)

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

  if (workers_dev) {
    return await publishOnWorkersDev(api, account_id, script_name)
  } else {
    if ('routes' in config) {
      var promises = config['routes'].map(r => publishOnZoneRoute(api, zone_id,
                                                                  r, script_name))
      return await Promise.all(promises)
    }
    return await publishOnZoneRoute(api, zone_id, route, script_name)
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
  log.tick(`Config valid.`)
}

function checkValidityForZoneRoutes(config: ConfigTypes.CFWorkers) {
  const required_keys: Array<keyof ConfigTypes.CFWorkers> = [
    'account_id',
    'api_token',
    'script_name',
    'zone_id',
    'route',
    'routes',
  ]
  const missing_config = required_keys.filter((k) => !config[k])
  if (missing_config.length > 0) {
    if (!(missing_config.length === 1 && (missing_config[0] === 'route' ||
                                          missing_config[0] === 'routes'))) {
      throw new InvalidConfigError(`Missing required keys for @fab/deploy-cf-workers (with 💛workers_dev: false💛):
        ${missing_config.map((k) => `💛• ${k}💛`).join('\n')}`)
    }
  }
  if ('routes' in config) {
    let routes = config['routes']
    if (!Array.isArray(routes)) {
      throw new InvalidConfigError(`value for \`routes\` key of @fab/deploy-cf-workers config should be an Array`)
    }
    if ([...new Set(routes)].length !== routes.length) {
      throw new InvalidConfigError(`Duplicate item in value for \`routes\` key of @fab/deploy-cf-workers config`)
    }
  }
  log.tick(`Config valid.`)
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
  await createPackage(fab_path, package_path, config, env_overrides, assets_url)
  const bindings = []

  if (api.account_supports_kv) {
    const cache_namespace = `FAB cache (${script_name})`
    const namespace = await api.getOrCreateNamespace(cache_namespace)
    bindings.push({
      type: 'kv_namespace',
      name: 'KV_FAB_CACHE',
      namespace_id: namespace.id,
    })
  } else {
    log.note(`Cloudflare KV support required for caching.
    Your FAB will not break but no caching will be possible between requests.
    See 🖤https://fab.dev/kb/caching🖤 for more information.`)
  }

  log.time(`Uploading script...`)
  const assets_in_kv = assets_url.match(/kv:\/\/(\w+)/)
  if (assets_in_kv) {
    const [_, namespace_id] = assets_in_kv

    bindings.push({
      type: 'kv_namespace',
      name: 'KV_FAB_ASSETS',
      namespace_id,
    })
  }

  const metadata = {
    body_part: 'script',
    bindings,
  }

  const body = new Multipart()
  body.append('metadata', JSON.stringify(metadata))
  body.append('script', await fs.readFile(package_path, 'utf8'), {
    contentType: 'application/javascript',
  })

  const upload_response = await api.put(
    `/accounts/${account_id}/workers/scripts/${script_name}`,
    {
      body: (body as unknown) as FormData,
      headers: body.getHeaders(),
    }
  )

  if (!upload_response.success) {
    throw new FabDeployError(`Error uploading the script, got response:
    ❤️${JSON.stringify(upload_response)}❤️`)
  }
  log.tick(`Uploaded, publishing...`)
}

async function publishOnWorkersDev(
  api: CloudflareApi,
  account_id: string,
  script_name: string
) {
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
  log.tick(`Done.`)
  log.time((d) => `Deployed in ${d}.`)

  return `https://${script_name}.${subdomain}.workers.dev`
}

async function publishOnZoneRoute(
  api: CloudflareApi,
  zone_id: string,
  route: string,
  script_name: string
) {
  const list_routes_response = await api.get(`/zones/${zone_id}/workers/routes`)
  if (!list_routes_response.success) {
    throw new FabDeployError(`Error listing routes on zone 💛${zone_id}💛:
      ❤️${JSON.stringify(list_routes_response)}❤️`)
  }

  const existing_route = list_routes_response.result.find((r: any) => r.pattern === route)
  if (existing_route) {
    const { id, script } = existing_route
    if (script === script_name) {
      log(
        `💚Route already exists!💚: pattern 💛${route}💛 already points at script 💛${script_name}💛`
      )
    } else {
      log(`Found existing route id 💛${id}💛, updating...`)
      const update_route_response = await api.put(
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
    log(
      `No existing route found for 💛${route}💛, creating one to point to script 💛${script_name}💛`
    )
    const create_route_response = await api.post(`/zones/${zone_id}/workers/routes`, {
      body: JSON.stringify({ pattern: route, script: script_name }),
    })
    if (!create_route_response.success) {
      throw new FabDeployError(`Error publishing to route 💛${route}💛 on zone 💛${zone_id}💛:
      ❤️${JSON.stringify(create_route_response)}❤️`)
    }
  }
  log.tick(`Done.`)
  log.time((d) => `Deployed in ${d}.`)

  return new URL(route).origin
}
