import { Command, flags } from '@oclif/command'
import Builder from '../Builder'
import * as path from 'path'

class Build extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ fab-afterjs build ~/src/my-project
`
  ]

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-o, --output=VALUE)
    output: flags.string({
      char: 'o',
      description: 'Output FAB directory',
      default: '.fab'
    })
  }

  static args = [
    {
      name: 'directory',
      default: '.'
    }
  ]

  async run() {
    const { args, flags } = this.parse(Build)
    const { directory } = args
    const { output } = flags
    return await Builder.start(path.resolve(directory), path.resolve(output!))
  }
}

export = Build
