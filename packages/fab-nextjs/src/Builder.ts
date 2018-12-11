import * as fs from 'fs-extra'
import * as path from 'path'
import * as util from 'util'
import * as globby from 'globby'
import Compiler from '@fab/compile/lib/Compiler'
import chalk from 'chalk'

const _log = (str: string) =>
  `${chalk.gray(`[FAB:NextJS]`)} ${str.split(/\n\s*/).join('\n             ')}`
const log = (str: string) => console.log(_log(str))
const error = (str: string) => console.log(_log(chalk.red(str)))

export default class Builder {
  static async start(
    dir: string,
    working_dir: string,
    output_file: string,
    intermediate_only: boolean
  ) {
    if (!(await fs.pathExists(dir))) {
      error(`${dir} doesn't exist!`)
      throw new Error('Missing directory')
    }

    log(`Building ${chalk.green(dir)}`)
    const assets_path = path.join(dir, '.next', 'build-manifest.json')

    if (!(await fs.pathExists(assets_path))) {
      error(`Missing build manifest in ${assets_path}.`)
      log(
        `The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

      throw new Error('Missing .next/build-manifest.json')
    }
  }
}
