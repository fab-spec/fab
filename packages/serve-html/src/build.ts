import { ProtoFab } from '@fab/core/src'
import { ServeHtmlArgs, ServeHtmlMetadata, ServerHtmls } from './types'
import cheerio from 'cheerio'
import mustache from 'mustache'

export async function build(args: ServeHtmlArgs, proto_fab: ProtoFab<ServeHtmlMetadata>) {
  const { 'match-html': match_html = /\.html$/i } = args

  const htmls: ServerHtmls = {}

  for (const [filename, contents] of proto_fab.files.entries()) {
    if (filename.match(match_html)) {
      proto_fab.files.delete(filename)

      const $ = cheerio.load(
        contents.replace(/{{{|{{/g, (match) =>
          match.length === 3 ? `{{{ OPEN_TRIPLE }}}` : `{{{ OPEN_DOUBLE }}}`
        )
      )
      $('head').prepend('{{{ FAB_ENV_INJECTION }}}')
      // $('script').attr('nonce', '{{ FAB_NONCE }}')

      const template = $.html()
      htmls[filename] = mustache.parse(template)

      // console.log(
      //   new mustache.Writer().renderTokens(
      //     tokens,
      //     new mustache.Context({
      //       FAB_ENV_INJECTION: 'HIHIHIHI',
      //     }),
      //     null,
      //     null
      //   )
      // )
    }
  }

  proto_fab.metadata.serve_html = {
    htmls,
  }
}
