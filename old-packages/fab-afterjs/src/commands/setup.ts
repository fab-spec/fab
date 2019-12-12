import { Command, flags } from '@oclif/command'
import * as path from 'path'
import * as fs from 'fs-extra'
import chalk from 'chalk'

export default class Setup extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' })
  }

  static args = [
    {
      name: 'directory',
      default: '.'
    }
  ]

  async run() {
    const { args, flags } = this.parse(Setup)
    const { directory } = args
    const { force } = flags
    const dir = path.resolve(directory)

    console.log(
      `${chalk.green('*')} Setting up After.js project for FAB in ${chalk.green(
        dir
      )}`
    )
    const node_index_exists = await fs.pathExists(
      path.resolve(directory, 'src/index.node.js')
    )
    const fab_index_exists = await fs.pathExists(
      path.resolve(directory, 'src/index.fab.js')
    )
    const index_exists = await fs.pathExists(
      path.resolve(directory, 'src/index.js')
    )

    if (node_index_exists && !fab_index_exists && index_exists) {
      console.log(`✅ Looks like this has already run. Leaving index.node.js and index.js as they are.`)
      return
    }

    if (node_index_exists) {
      console.log(
        chalk.red(
          `src/index.node.js already exists in project!\n  This command will rename src/index.js to src/index.node.js, but will not overwrite any existing files.`
        )
      )
      throw new Error('index.node.js exists')
    }

    if (fab_index_exists && !force) {
      console.log(
        `${chalk.green(
          'Note: src/index.fab.js already exists in project.'
        )}\nUsing the current file (use -f to generate a new file and overwrite).`
      )
    } else {
      await fs.copy(
        path.resolve(__dirname, '../files/index.fab.js'),
        path.resolve(directory, 'src/index.fab.js'),
        { overwrite: true }
      )
    }

    console.log(
      `${chalk.green('*')} Moving ${chalk.green(
        'src/index.js'
      )} to ${chalk.green('src/index.node.js')}`
    )
    await fs.move(
      path.resolve(directory, 'src/index.js'),
      path.resolve(directory, 'src/index.node.js'),
      { overwrite: false }
    )

    console.log(
      `${chalk.green('*')} Moving ${chalk.green(
        'src/index.fab.js'
      )} to ${chalk.green('src/index.js')}`
    )
    await fs.move(
      path.resolve(directory, 'src/index.fab.js'),
      path.resolve(directory, 'src/index.js'),
      { overwrite: false }
    )

    console.log(`${chalk.green('Done.')} Ready to run razzle build.`)
  }
}
