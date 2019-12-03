import { Command, flags } from '@oclif/command'
import * as path from 'path'
import chalk from 'chalk'
import * as fs from 'fs-extra'

export default class Teardown extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' })
  }

  static args = [
    {
      name: 'directory',
      default: '.'
    }
  ]

  async run() {
    const { args } = this.parse(Teardown)
    const { directory } = args
    const dir = path.resolve(directory)

    console.log(
      `${chalk.green('*')} Restoring After.js project for NodeJS in ${chalk.green(
        dir
      )}`
    )

    const fab_index_exists = await fs.pathExists(
      path.resolve(directory, 'src/index.fab.js')
    )
    if (fab_index_exists) {
      console.log(
        chalk.red(
          `src/index.fab.js already exists in project!\n  This command will rename src/index.js to src/index.fab.js, but will not overwrite any existing files.`
        )
      )
      throw new Error('index.fab.js exists')
    }

    const node_index_exists = await fs.pathExists(
      path.resolve(directory, 'src/index.node.js')
    )
    if (!node_index_exists) {
      console.log(
        chalk.red(
          `src/index.node.js doesn't exist in project!\n  This command will restore src/index.node.js to src/index.js, but that file is missing.`
        )
      )
      throw new Error(`index.node.js doesn't exist`)
    }

    console.log(
      `${chalk.green('*')} Moving ${chalk.green(
        'src/index.js'
      )} to ${chalk.green('src/index.fab.js')}`
    )
    await fs.move(
      path.resolve(directory, 'src/index.js'),
      path.resolve(directory, 'src/index.fab.js'),
      { overwrite: false }
    )

    console.log(
      `${chalk.green('*')} Moving ${chalk.green(
        'src/index.node.js'
      )} to ${chalk.green('src/index.js')}`
    )
    await fs.move(
      path.resolve(directory, 'src/index.node.js'),
      path.resolve(directory, 'src/index.js'),
      { overwrite: false }
    )

    console.log(`${chalk.green('Done.')} OK to run razzle start.`)
  }
}
