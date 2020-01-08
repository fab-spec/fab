export * from './BuildFailed'
export * from './InvalidConfig'
export * from './InvalidPlugin'
export * from './MissingConfig'

import { createDescriptiveErrorClass } from './DescriptiveError'

export const FabInitError = createDescriptiveErrorClass('Fab init failed!')
