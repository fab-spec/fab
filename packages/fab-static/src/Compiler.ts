import * as fs from 'fs-extra'
import * as path from 'path'

export default class Compiler {
  static async compile(input_file: string) {
    const input_path = path.resolve(input_file)

    const html = await fs.readFile(input_path, 'utf8')

    console.log({html})

    return html
  }
}
