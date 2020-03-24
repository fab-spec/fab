import { FabDeployer, FabPackager } from '@fab/core'

export const deploy: FabDeployer = async (fab_path: string, package_path: string) => {
  throw new Error('Not implemented! Use `fab package` and deploy manually.')
}

export * from './createPackage'
