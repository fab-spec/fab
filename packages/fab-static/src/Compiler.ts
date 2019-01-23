import * as fs from 'fs-extra'
import * as path from 'path'
import * as cheerio from 'cheerio'

export default class Compiler {
  static async compile(input_file: string) {
    const input_path = path.resolve(input_file)

    const html = await fs.readFile(input_path, 'utf8')

    const $ = cheerio.load(html)
    $('head').prepend('{{{ FAB_ENV_INJECTION }}}')
    $('script').attr('nonce', '{{ FAB_NONCE }}')

    return $.html()
  }
}
