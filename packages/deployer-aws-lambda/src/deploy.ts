import { ConfigTypes, FabServerDeployer, FabSettings } from '@fab/core'
import { createPackage } from './createPackage'
import path from 'path'
import { InvalidConfigError } from '@fab/cli'
import { updateCloudFront, updateLambda } from './aws'
import { log } from './utils'

export const deployServer: FabServerDeployer<ConfigTypes.AwsLambda> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.AwsLambda,
  env_overrides: FabSettings,
  assets_url: string
) => {
  // TODO, hash the FAB, figure out if we actually need to do this
  const package_path = path.join(working_dir, 'aws-lambda.zip')
  log(`Starting 💛server💛 deploy...`)

  const { access_key, secret_key, region, cf_distribution_id, lambda_arn } = config

  const required_keys: Array<keyof ConfigTypes.AwsLambda> = [
    'access_key',
    'secret_key',
    'region',
    'cf_distribution_id',
    'lambda_arn',
  ]
  const missing_config = required_keys.filter((k) => !config[k])
  if (missing_config.length > 0) {
    throw new InvalidConfigError(`Missing required keys for @fab/deploy-aws-lambda:
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
    version!
  )
  log.time((d) => `Deployed in ${d}.`)
  return url
}
