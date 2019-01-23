import * as fs from 'fs-extra'
import * as path from 'path'
import * as cheerio from 'cheerio'
import * as mustache from 'mustache'

export default class Compiler {
  static async compile(input_file: string) {
    const input_path = path.resolve(input_file)

    const html = await fs.readFile(input_path, 'utf8')

    const $ = cheerio.load(
      html.replace(
        /{{{|{{/g,
        match => (match.length === 3 ? `{{{ OPEN_TRIPLE }}}` : `{{{ OPEN_DOUBLE }}}`)
      )
    )
    $('head').prepend('{{{ FAB_ENV_INJECTION }}}')
    $('script').attr('nonce', '{{ FAB_NONCE }}')

    return $.html()
  }

  static render(input_template: string, view: { [key: string]: string }) {
    return mustache.render(input_template, {
      ...view,
      OPEN_TRIPLE: '{{{',
      OPEN_DOUBLE: '{{'
    })
  }
}
