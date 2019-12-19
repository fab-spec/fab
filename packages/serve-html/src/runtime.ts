import { ServeHtmlArgs, ServeHtmlMetadata } from './types'
import { FabPluginRuntime, matchPath } from '@fab/core'
import mustache from 'mustache'

export const runtime: FabPluginRuntime<ServeHtmlArgs, ServeHtmlMetadata> = (
  args: ServeHtmlArgs,
  metadata: ServeHtmlMetadata
) => {
  const htmls = metadata.serve_html.htmls
  const writer = new mustache.Writer()

  return async function({ url, settings }) {
    const { pathname } = url

    const html = matchPath(htmls, pathname)
    if (html) {
      const rendered = writer.renderTokens(
        // @ts-ignore
        html,
        new mustache.Context({
          FAB_ENV_INJECTION: `<script>window.FAB_SETTINGS=${JSON.stringify(
            settings
          )};</script>`,
        }),
        null,
        null
      )

      return new Response(rendered, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    return undefined
  }
}
