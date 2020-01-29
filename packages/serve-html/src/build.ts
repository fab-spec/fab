import { ProtoFab } from '@fab/core'
import { ServeHtmlArgs, ServeHtmlMetadata, ServerHtmls } from './types'
import cheerio from 'cheerio'
import mustache from 'mustache'
import { DEFAULT_INJECTIONS } from './constants'
import { addInjectionPoint } from './injections/env'

export async function build(args: ServeHtmlArgs, proto_fab: ProtoFab<ServeHtmlMetadata>) {
  const { 'match-html': match_html = /\.html$/i, injections = DEFAULT_INJECTIONS } = args

  const htmls: ServerHtmls = {}

  for (const [filename, contents] of proto_fab.files.entries()) {
    if (filename.match(match_html)) {
      proto_fab.files.delete(filename)

      const $ = cheerio.load(
        contents.replace(/{{{|{{/g, (match) =>
          match.length === 3 ? `{{{ OPEN_TRIPLE }}}` : `{{{ OPEN_DOUBLE }}}`
        )
      )

      if (injections.env) {
        addInjectionPoint($)
      }
      // $('script').attr('nonce', '{{ FAB_NONCE }}')

      const template = $.html()
      htmls[filename] = mustache.parse(template)
    }
  }

  proto_fab.metadata.serve_html = {
    htmls,
  }
}
