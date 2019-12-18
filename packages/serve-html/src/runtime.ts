import { ServeHtmlArgs, ServeHtmlMetadata } from './types'
import { FabPluginRuntime } from '@fab/core'

export const runtime: FabPluginRuntime<ServeHtmlArgs, ServeHtmlMetadata> = (
  args: ServeHtmlArgs,
  metadata: ServeHtmlMetadata
) => {
  const htmls = metadata.serve_html.htmls
  console.log({ htmls })

  return async function({}) {
    return undefined
  }
}
