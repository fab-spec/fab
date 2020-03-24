import { FabDeployer } from '@fab/core'

export async function deploy(fab_path: string, package_path: string): FabDeployer {
  throw new Error('Not implemented! Use `fab package` and deploy manually.')
}

export async function createPackage(
  fab_path: string,
  package_path: string
): FabDeployer {}
