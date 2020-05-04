import { ProtoFab } from '@fab/core'
import { ServeHtmlArgs, ServeHtmlMetadata, ServerHtmls } from './types'
import cheerio from 'cheerio'
import { tokenize } from 'micromustache'
import { DEFAULT_INJECTIONS } from './constants'
import { addInjectionPoint } from './injections/env'
import { _log, InvalidConfigError } from '@fab/cli'
const log = _log('@fab/plugin-render-html')

export async function build(args: ServeHtmlArgs, proto_fab: ProtoFab<ServeHtmlMetadata>) {
  const {
    'match-html': match_html = /\.html$/i,
    injections = DEFAULT_INJECTIONS,
    fallback = true,
  } = args

  const htmls: ServerHtmls = {}
  let html_count = 0

  for (const [filename, contents] of proto_fab.files.entries()) {
    if (filename.match(match_html)) {
      html_count++
      proto_fab.files.delete(filename)

      const $ = cheerio.load(
        contents
          .toString('utf8')
          .replace(/{{{|{{/g, (match) =>
            match.length === 3 ? `{{ OPEN_TRIPLE }}` : `{{ OPEN_DOUBLE }}`
          )
      )

      if (injections.env) {
        addInjectionPoint($)
      }
      // $('script').attr('nonce', '{{ FAB_NONCE }}')

      const template = $.html()
      htmls[filename] = tokenize(template)
      // console.log(filename)
      // console.log(htmls[filename].strings.map(str => str.slice(0, 100)))
      // console.log(htmls[filename].varNames)
      log.tick(`🖤${filename}🖤`, 2)
      // await new Promise((res) => setTimeout(res, 200))
    }
  }

  log(`Compiled 💛${html_count} html files💛.`)

  const resolved_fallback =
    typeof fallback === 'string'
      ? fallback
      : fallback === true
      ? '/index.html'
      : undefined

  if (resolved_fallback) {
    if (!htmls[resolved_fallback]) {
      if (typeof fallback === 'string') {
        throw new InvalidConfigError(
          `@fab/plugin-render-html specifies a fallback of '${fallback}', which doesn't exist.`
        )
      } else {
        log.warn(
          `@fab/plugin-render-html has 'fallback: true', but '${resolved_fallback}' doesn't exist! Skipping.`
        )
      }
    }
    log(`Using fallback of 💛${resolved_fallback}💛.`)
  } else {
    log(`No fallback injected.`)
  }

  proto_fab.metadata.serve_html = {
    htmls,
    resolved_fallback,
  }
}
