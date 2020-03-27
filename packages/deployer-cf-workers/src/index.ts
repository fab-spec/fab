import { FabDeployer, FabPackager, FabPackagerConfig } from '@fab/core'

export const deploy: FabDeployer<{}> = async (
  fab_path: string,
  package_path: string,
  config: {}
) => {
  throw new Error('Not implemented! Use `fab package` and deploy manually.')
}

export const createPackage: FabPackager<FabPackagerConfig> = async (
  fab_path: string,
  package_path: string
) => {
  console.log('CF WORKERS PACKAGER!')
}
