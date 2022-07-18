import { ConfigTypes, FabServerDeployer, FabSettings } from '@dev-spendesk/fab-core'
import { createPackage } from './createPackage'
import path from 'path'
import { InvalidConfigError } from '@dev-spendesk/fab-cli'
import { updateCloudFront, updateLambda } from './aws'
import { log } from './utils'

export const deployServer: FabServerDeployer<ConfigTypes.AwsLambda> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.AwsLambda,
  env_overrides: Map<string, FabSettings>,
  assets_url: string
) => {
  // TODO, hash the FAB, figure out if we actually need to do this
  const package_path = path.join(working_dir, 'aws-lambda.zip')
  log(`Starting 💛server💛 deploy...`)

  const {
    access_key,
    secret_key,
    region,
    cf_distribution_id,
    lambda_arn,
    routes_for_invalidation,
  } = config

  const required_keys: Array<keyof ConfigTypes.AwsLambda> = [
    'region',
    'cf_distribution_id',
    'lambda_arn',
  ]
  const missing_config = required_keys.filter((k) => !config[k])
  if (missing_config.length > 0) {
    throw new InvalidConfigError(`Missing required keys for @dev-spendesk/deploy-aws-lambda:
    ${missing_config.map((k) => `💛• ${k}💛`).join('\n')}`)
  }

  await createPackage(fab_path, package_path, config, env_overrides, assets_url)

  log.time(`Deploying to AWS Lambda@Edge with config:
    ${Object.entries(config)
      .map(([k, v]) => `🖤${k}: ${k.match(/secret/) ? '•'.repeat(v.length) : v}🖤`)
      .join('\n')}`)

  const version = await updateLambda(
    package_path,
    access_key,
    secret_key,
    lambda_arn,
    region
  )
  const url = await updateCloudFront(
    access_key,
    secret_key,
    lambda_arn,
    cf_distribution_id,
    region,
    version!,
    routes_for_invalidation
  )
  log.time((d) => `Deployed in ${d}.`)
  return url
}
