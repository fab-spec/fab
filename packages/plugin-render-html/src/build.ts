import { ProtoFab } from '@dev-spendesk/fab-core'
import { RenderHtmlArgs, RenderHtmlMetadata, CompiledHTMLs, AssetHTMLs } from './types'
import cheerio from 'cheerio'
import { tokenize } from 'micromustache'
import { DEFAULT_INJECTIONS } from './constants'
import { addInjectionPoint } from './injections/env'
import { InvalidConfigError, _log } from '@dev-spendesk/fab-cli'
import hasha from 'hasha'
import path from 'path'

const getFingerprintedName = (contents: Buffer, filename: string) => {
  const hash = hasha(contents, { algorithm: 'md5' }).slice(0, 9)
  const extname = path.extname(filename)
  return extname
    ? `${filename.slice(0, -1 * extname.length)}.${hash}${extname}`
    : `${filename}_${hash}`
}

const log = _log('@dev-spendesk/fab-plugin-render-html')

export async function build(
  args: RenderHtmlArgs,
  proto_fab: ProtoFab<RenderHtmlMetadata>
) {
  const {
    'match-html': match_html = /\.html$/i,
    injections = DEFAULT_INJECTIONS,
    fallback = true,
    inline = 'fallback-only',
  } = args

  const htmls: CompiledHTMLs = {}
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
      // log.tick(`🖤${filename}🖤`, 2)
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
          `@dev-spendesk/fab-plugin-render-html specifies a fallback of '${fallback}', which doesn't exist.`
        )
      } else {
        log.warn(
          `@dev-spendesk/fab-plugin-render-html has 'fallback: true', but '${resolved_fallback}' doesn't exist! Skipping.`
        )
      }
    }
    log(`Using fallback of 💛${resolved_fallback}💛.`)
  } else {
    log(`No fallback injected.`)
  }

  const inlined_htmls: CompiledHTMLs = inline === true ? htmls : {}
  const asset_html_paths: AssetHTMLs = {}

  if (inline !== true) {
    for (const [path, tokens] of Object.entries(htmls)) {
      const should_be_inlined =
        inline === false
          ? false
          : inline === 'fallback-only' && path === resolved_fallback

      if (should_be_inlined) {
        inlined_htmls[path] = tokens
      } else {
        const buffer = Buffer.from(JSON.stringify(tokens))
        const asset_path = getFingerprintedName(buffer, `/_assets/_html${path}.json`)
        asset_html_paths[path] = asset_path
        proto_fab.files.set(asset_path, buffer)
      }
    }
  }

  proto_fab.metadata.render_html = {
    inlined_htmls,
    resolved_fallback,
    asset_html_paths,
  }
}
