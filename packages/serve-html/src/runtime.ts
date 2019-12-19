import { ServeHtmlArgs, ServeHtmlMetadata } from './types'
import { FabPluginRuntime, matchPath } from '@fab/core'
import mustache from 'mustache'
import { DEFAULT_INJECTIONS } from './constants'

export const runtime: FabPluginRuntime<ServeHtmlArgs, ServeHtmlMetadata> = (
  args: ServeHtmlArgs,
  metadata: ServeHtmlMetadata
) => {
  const { injections = DEFAULT_INJECTIONS } = args

  const htmls = metadata.serve_html.htmls
  const writer = new mustache.Writer()

  return async function({ url, settings }) {
    const { pathname } = url

    const html = matchPath(htmls, pathname)
    if (html) {
      const replacements: { [token: string]: string } = {
        OPEN_TRIPLE: '{{{',
        OPEN_DOUBLE: '{{',
      }

      if (injections.env) {
        const name = injections.env.name || DEFAULT_INJECTIONS.env.name
        const settings_json = JSON.stringify(settings)
        replacements.FAB_ENV_INJECTION = `<script>window.${name}=${settings_json};</script>`
      }

      const rendered = writer.renderTokens(
        // @ts-ignore
        html,
        new mustache.Context(replacements),
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
