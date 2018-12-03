import * as fs from 'fs-extra'
import chalk from 'chalk'

export default class Builder {
  static async start(
    dir: string,
    output_file: string,
    wip_dir: string,
    redirect: string | undefined
  ) {
    console.log(`Building ${chalk.green(dir)}`)

    if (!(await fs.pathExists(dir))) {
      console.log(chalk.red(`${dir} doesn't exist!`))
      throw new Error(`Directory doesn't exist`)
    }

    fs.remove(wip_dir)

  }
}
