import { ProtoFab } from '@fab/core/src'
import { ServeHtmlArgs, ServeHtmlMetadata } from './types'

export async function build(args: ServeHtmlArgs, proto_fab: ProtoFab<ServeHtmlMetadata>) {
  const { 'match-html': match_html = /\.html$/i } = args

  for (const [filename, contents] of proto_fab.files.entries()) {
    if (filename.match(match_html)) {
      proto_fab.files.delete(filename)
    }
  }
}
