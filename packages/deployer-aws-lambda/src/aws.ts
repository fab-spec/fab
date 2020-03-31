import aws, { CloudFront } from 'aws-sdk'
import fs from 'fs-extra'

export const updateCloudFront = async (
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
export const update_lambda = async (
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
