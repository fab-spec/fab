import { RenderHtmlArgs, RenderHtmlMetadata } from './types'
import {
  FABRuntime,
  FabSettings,
  matchPath,
  NO_RESPONSE_STATUS_CODE,
  Priority,
} from '@fab/core'
import { DEFAULT_INJECTIONS } from './constants'
import { generateReplacements } from './injections/env'
import { ITokens } from 'micromustache'

// Todo: this should be part of the context.
// Maybe it should be optional though, with this as the fallback.
const getNonce = () => {
  return Math.random()
    .toString(16)
    .slice(2)
}

type LazyHtmlTokens = { tokens: Promise<ITokens> | null; asset_path?: string }

async function fetchTokens(path: string): Promise<ITokens> {
  const response = await fetch(path)
  console.log({ response })
  return await response.json()
}

export default function RenderHTMLRuntime(
  { Router, Metadata }: FABRuntime<RenderHtmlMetadata>,
  args: RenderHtmlArgs
) {
  const { inlined_htmls, resolved_fallback, asset_html_paths } = Metadata.render_html

  const all_htmls: { [path: string]: LazyHtmlTokens } = {}
  for (const [path, tokens] of Object.entries(inlined_htmls)) {
    all_htmls[path] = { tokens: Promise.resolve(tokens) }
  }
  for (const [url_path, asset_path] of Object.entries(asset_html_paths)) {
    all_htmls[url_path] = { tokens: null, asset_path }
  }

  const { injections = DEFAULT_INJECTIONS } = args
  const error_page = matchPath(all_htmls, '/404')

  async function render(html: LazyHtmlTokens, settings: FabSettings) {
    if (!html.tokens) {
      html.tokens = fetchTokens(html.asset_path!)
    }
    const tokens = await html.tokens

    const replacements: { [token: string]: string } = {
      OPEN_TRIPLE: '{{{',
      OPEN_DOUBLE: '{{',
    }

    if (injections.env) {
      Object.assign(replacements, generateReplacements(injections.env, settings))
    }

    const rendered = stringify(tokens, replacements)

    return new Response(rendered, {
      status: html === error_page ? 404 : 200,
      statusText: html === error_page ? 'Not found' : 'Ok',
      headers: {
        'content-type': 'text/html',
      },
    })
  }

  function stringify(tokens: ITokens, values: { [key: string]: string }): string {
    const { strings, varNames } = tokens
    let ret = ''
    const { length } = varNames
    for (let i = 0; i < length; i++) {
      ret += strings[i]
      ret += values[varNames[i]]
    }

    ret += strings[length]
    return ret
  }

  Router.onAll(async ({ url, settings }) => {
    const { pathname } = url

    const html = matchPath(all_htmls, pathname)
    if (html) {
      return await render(html, settings)
    }

    if (resolved_fallback)
      return {
        async interceptResponse(response: Response) {
          return response.status === NO_RESPONSE_STATUS_CODE
            ? await render(all_htmls[resolved_fallback], settings)
            : response
        },
      }

    if (error_page)
      return {
        async interceptResponse(response: Response) {
          return response.status === NO_RESPONSE_STATUS_CODE
            ? await render(error_page, settings)
            : response
        },
      }

    return undefined
  }, Priority.LATER)
}
