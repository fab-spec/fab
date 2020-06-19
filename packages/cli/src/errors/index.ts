export * from './BuildFailed'
export * from './InvalidConfig'
export * from './InvalidPlugin'
export * from './MissingConfig'

import { createDescriptiveErrorClass } from './DescriptiveError'

export const FabInitError = createDescriptiveErrorClass('Fab init failed!')
export const FabDeployError = createDescriptiveErrorClass('Fab deploy failed!')
export const FabPackageError = createDescriptiveErrorClass('Fab package failed!')
export const FabServerError = createDescriptiveErrorClass('Fab serve failed!')
