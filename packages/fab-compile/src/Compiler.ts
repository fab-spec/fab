import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as util from 'util'
import * as globby from 'globby'
import * as path from 'path'
// @ts-ignore
import * as _zip from 'deterministic-zip'
const zip = util.promisify(_zip)

export default class Compiler {
  static async compile(input_dir: string) {
    const input_path = path.resolve(input_dir)
    console.log(`[FAB:Compile] Compiling ${chalk.green(input_path)}`)



  }
}