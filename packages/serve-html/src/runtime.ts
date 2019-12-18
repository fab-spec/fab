import { ServeHtmlArgs, ServeHtmlMetadata } from './types'
import { FabPluginRuntime } from '@fab/core'

export const runtime: FabPluginRuntime<ServeHtmlArgs, ServeHtmlMetadata> = (
  args: ServeHtmlArgs,
  metadata: ServeHtmlMetadata
) => {
  return async function({}) {
    return undefined
  }
}
