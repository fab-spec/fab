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
  log.tick(`Read lambda package. Uploading...`)
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

  log(
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
  version: string,
  routes_for_invalidation: string[] = ['/']
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
  log(
    `💚✔💚 Done.${
      config.DistributionConfig?.Comment
        ? ` Found distribution comment: '💛${config.DistributionConfig.Comment}💛'`
        : ''
    }`
  )

  // Todo: replace DistributionConfig.Origins and DistributionConfig!.CacheBehaviors
  // with static/dynamic config we in
  // console.log(config.DistributionConfig)
  // console.log(config.DistributionConfig!.Origins)
  // console.log(config.DistributionConfig!.Origins.Items[0])
  // console.log(config.DistributionConfig!.Origins.Items[1])
  // console.log(config.DistributionConfig!.CacheBehaviors)
  // console.log(config.DistributionConfig!.DefaultCacheBehavior)
  // @ts-ignore
  // console.log(config.DefaultCacheBehavior.LambdaFunctionAssociations)
  const LambdaFunctionARN = `${lambda_arn}:${version}`
  // @ts-ignore
  config.DefaultCacheBehavior.LambdaFunctionAssociations = {
    Quantity: 1,
    Items: [
      {
        LambdaFunctionARN,
        EventType: 'origin-request',
      },
    ],
  }
  // @ts-ignore
  // console.log(config.DefaultCacheBehavior.LambdaFunctionAssociations)
  const params = {
    DistributionConfig: config.DistributionConfig as CloudFront.Types.DistributionConfig,
    Id: cf_distribution_id,
    IfMatch: config.ETag,
  }
  log(`Updating distribution to 💛${LambdaFunctionARN}💛`)

  // console.log({ params })
  const update_response = await cloudfront.updateDistribution(params).promise()
  const domains = [
    update_response.Distribution?.DomainName,
    ...(config.DistributionConfig?.Aliases?.Items || []),
  ]
  log.tick(`Done.`)
  log(`Got response status: 💛${update_response.Distribution?.Status}💛
    🖤(CloudFront can take a few minutes to update)🖤`)
  const num_invalidations = routes_for_invalidation.length
  log(
    `Invalidating ${num_invalidations} route${
      num_invalidations === 1 ? '' : 's'
    }: ${(num_invalidations > 4
      ? routes_for_invalidation.slice(0, 4).concat('...')
      : routes_for_invalidation
    )
      .map((r) => `💛${r}💛`)
      .join(', ')}`
  )

  try {
    await cloudfront
      .createInvalidation({
        DistributionId: cf_distribution_id,
        InvalidationBatch: {
          CallerReference: '' + new Date(),
          Paths: {
            Quantity: num_invalidations,
            Items: routes_for_invalidation,
          },
        },
      })
      .promise()

    log.tick(`Done.`)
  } catch (e) {
    log.cross(`Invalidation failed. Could be a permissions issue?`)
  }
  log(`Updated the following domain names:
    ${domains.map((d) => `💛  ${d}💛`).join('\n')}
  `)

  return `https://${domains[domains.length - 1]}`
}
