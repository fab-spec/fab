import { Command, flags } from '@oclif/command'
import Builder from './Builder'
import * as path from 'path'

class FabAfterjs extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' })
  }

  static args = [
    {
      name: 'directory',
      default: '.'
    }
  ]

  async run() {
    const { args } = this.parse(FabAfterjs)
    const { directory } = args
    return await Builder.start(path.resolve(directory))
  }
}

export = FabAfterjs
