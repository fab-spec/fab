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
    'working-dir': flags.string({
      char: 'w',
      description: 'Working FAB directory',
      default: '.fab'
    }),
    output: flags.string({
      char: 'o',
      description: 'Output FAB file',
      default: 'fab.zip'
    }),
    'intermediate-only': flags.boolean()
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
    return await Builder.start(
      path.resolve(directory),
      flags['working-dir']!,
      path.resolve(flags.output!),
      flags['intermediate-only']
    )
  }
}

export = Build
