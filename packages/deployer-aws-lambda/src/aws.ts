import aws, { CloudFront } from 'aws-sdk'
import fs from 'fs-extra'
import { log } from './utils'

export const updateLambda = async (
  package_path: string,
  accessKeyId: string,
  secretAccessKey: string,
  lambda_arn: string,
  region: string
) => {
  log(`Updating Lambda`)
  const package_contents = await fs.readFile(package_path)
  log.continue(`💚✔💚 Read lambda package. Uploading...`)
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

  log.continue(
    `💚✔💚 Updated lambda 💛${response.FunctionName}💛 🖤(version ${response.Version})🖤`
  )
  return response.Version
}

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
    region,
  })
  log(`Getting CloudFront distribution id 💛${cf_distribution_id}💛`)
  const config = await cloudfront
    .getDistributionConfig({ Id: cf_distribution_id })
    .promise()
  log.continue(
    `💚✔💚 Done.${
      config.DistributionConfig?.Comment
        ? ` Found distribution comment: '💛${config.DistributionConfig.Comment}💛'`
        : ''
    }`
  )
  // console.log(config.DistributionConfig)
  // @ts-ignore
  // console.log(config.DefaultCacheBehavior.LambdaFunctionAssociations)
  const LambdaFunctionARN = `${lambda_arn}:${version}`
  const lambda_config = {
    Quantity: 1,
    Items: [
      {
        LambdaFunctionARN,
        EventType: 'origin-request',
      },
    ],
  }
  // @ts-ignore
  config.DefaultCacheBehavior.LambdaFunctionAssociations = lambda_config
  // @ts-ignore
  // console.log(config.DefaultCacheBehavior.LambdaFunctionAssociations)
  const params = {
    DistributionConfig: config.DistributionConfig as CloudFront.Types.DistributionConfig,
    Id: cf_distribution_id,
    IfMatch: config.ETag,
  }
  log.continue(`Updating distribution to 💛${LambdaFunctionARN}💛`)

  // console.log({ params })
  const update_response = await cloudfront.updateDistribution(params).promise()
  const domains = [
    update_response.Distribution?.DomainName,
    ...(config.DistributionConfig?.Aliases?.Items || []),
  ]
  log.continue(`💚✔💚 Done. Updated the following domain names:
    ${domains.map((d) => `💛  ${d}💛`).join('\n')}
  `)
  log.continue(`Got response status: 💛${update_response.Distribution?.Status}💛
    🖤(CloudFront typically takes a few minutes to update)🖤
  `)
  return `https://${domains[domains.length - 1]}`
}
