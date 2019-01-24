import * as fs from 'fs-extra'
import chalk from 'chalk'

const _log = (str: string) =>
  `${chalk.gray(`[FAB:Static]`)} ${str.split(/\n\s*/).join('\n            ')}`
const log = (str: string) => console.log(_log(str))
const error = (str: string) => console.log(_log(chalk.red(str)))

interface Config {
  base_href: string
}

export default class Builder {
  static async start(
    dir: string,
    output_file: string,
    wip_dir: string,
    config_file: string
  ) {
    log(`Building ${chalk.green(dir)}`)

    if (!(await fs.pathExists(dir))) {
      error(`${dir} doesn't exist!`)
      throw new Error(`Directory doesn't exist`)
    }

    const config: Config = {
      base_href: '/',
    }
    if (await fs.pathExists(config_file)) {
      try {
        Object.apply(config, JSON.parse(await fs.readFile(config_file, 'utf8')))
      } catch (e) {
        error(`Error loading ${config_file}`)
        throw new Error(`Config file doesn't exist`)
      }
    }

    fs.emptyDir(wip_dir)

  }
}
