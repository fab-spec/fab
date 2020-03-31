import { ConfigTypes, FabServerDeployer, FabSettings } from '@fab/core'
import { createPackage } from './createPackage'
import path from 'path'
import fs from 'fs-extra'
import { _log, FabDeployError } from '@fab/cli'
import aws, { CloudFront } from 'aws-sdk'

const log = _log(`deployer-aws-lambda:deploy`)

const update_lambda = async (
  package_path: string,
  accessKeyId: string,
  secretAccessKey: string,
  lambda_arn: string,
  region: string
) => {
  const package_contents = await fs.readFile(package_path)
  const lambda = new aws.Lambda({
    accessKeyId,
    secretAccessKey,
    region,
  })
  const params = {
    FunctionName: lambda_arn,
    ZipFile: package_contents,
    Publish: true,
  }
  const response = await lambda.updateFunctionCode(params).promise()
  console.log({ response })
  return response.Version
}

const updateCloudFront = async (
  accessKeyId: string,
  secretAccessKey: string,
  lambda_arn: string,
  cf_distribution_id: string,
  region: string,
  version: string
) => {
  const cloudfront = new aws.CloudFront({
    accessKeyId,
    secretAccessKey,
    region: 'us-east-1',
  })
  const config = await cloudfront
    .getDistributionConfig({ Id: cf_distribution_id })
    .promise()
  console.log({ config })
  // @ts-ignore
  console.log(config.DefaultCacheBehavior.LambdaFunctionAssociations)
  const lambda_config = {
    Quantity: 1,
    Items: [
      {
        LambdaFunctionARN: `${lambda_arn}:${version}`,
        EventType: 'origin-request',
      },
    ],
  }
  // @ts-ignore
  config.DefaultCacheBehavior.LambdaFunctionAssociations = lambda_config
  // @ts-ignore
  console.log(config.DefaultCacheBehavior.LambdaFunctionAssociations)
  const params = {
    DistributionConfig: config.DistributionConfig as CloudFront.Types.DistributionConfig,
    Id: cf_distribution_id,
    IfMatch: config.ETag,
  }
  console.log({ params })
  const update_response = await cloudfront.updateDistribution(params).promise()
  console.log({ update_response })
}

export const deployServer: FabServerDeployer<ConfigTypes.AwsLambda> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.AwsLambda,
  env_overrides: FabSettings,
  assets_url: string
) => {
  // TODO, hash the FAB, figure out if we actually need to do this
  const package_path = path.join(working_dir, 'aws-lambda.zip')
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
