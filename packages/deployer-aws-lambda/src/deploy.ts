import { FabDeployer, AwsLambdaEdgeDeployConfig } from '@fab/core'
import { createPackage } from './createPackage'

export const deploy: FabDeployer<AwsLambdaEdgeDeployConfig> = async (
  fab_path: string,
  package_path: string,
  config: AwsLambdaEdgeDeployConfig
) => {
  await createPackage(fab_path, package_path)

  return `https://${''}`
}
