import * as fs from 'fs-extra'
import chalk from 'chalk'
import * as util from 'util'
import * as globby from 'globby'
// @ts-ignore
import * as _zip from 'deterministic-zip'
const zip = util.promisify(_zip)

export default class Compiler {
  static async compile(input_dir: string) {
    console.log(`[FAB:Compile] Compiling ${chalk.green(input_dir)}`)



  }
}