import { FabServerDeployer, AwsLambdaEdgeDeployConfig } from '@fab/core'
import { createPackage } from './createPackage'
import path from 'path'
import fs from 'fs-extra'
import { _log } from '@fab/cli'

const log = _log(`deployer-aws-lambda:deploy`)

export const deployServer: FabServerDeployer<AwsLambdaEdgeDeployConfig> = async (
  fab_path: string,
  working_dir: string,
  assets_url: string,
  config: AwsLambdaEdgeDeployConfig
) => {
  const package_path = path.join(working_dir, 'aws-lambda.zip')
  await createPackage(fab_path, package_path, { assets_url })

  return `https://${package_path}`
}
