import { ConfigTypes, FabServerDeployer, FabSettings } from '@fab/core'
import { createPackage } from './createPackage'
import path from 'path'
import { _log, FabDeployError } from '@fab/cli'
import { update_lambda, updateCloudFront } from './aws'

const log = _log(`@fab/deployer-aws-lambda`)

export const deployServer: FabServerDeployer<ConfigTypes.AwsLambda> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.AwsLambda,
  env_overrides: FabSettings,
  assets_url: string
) => {
  // TODO, hash the FAB, figure out if we actually need to do this
  const package_path = path.join(working_dir, 'aws-lambda.zip')
  log(`Deploying to AWS Lambda@Edge`)
  await createPackage(fab_path, package_path, config, env_overrides, assets_url)

  const { access_key, secret_key, region, cf_distribution_id, lambda_arn } = config

  console.log({ config })

  const anyMissing = [
    access_key,
    secret_key,
    region,
    cf_distribution_id,
    lambda_arn,
  ].some((x) => !x)

  if (anyMissing) {
    throw new FabDeployError(`Missing config!`)
  }

  const version = await update_lambda(
    package_path,
    access_key,
    secret_key,
    lambda_arn,
    region
  )
  await updateCloudFront(
    access_key,
    secret_key,
    lambda_arn,
    cf_distribution_id,
    region,
    version!
  )

  return `https://${package_path}`
}
