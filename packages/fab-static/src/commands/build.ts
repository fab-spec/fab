import { Command, flags } from '@oclif/command'
import Builder from '../Builder'
import * as path from 'path'

export default class Build extends Command {
  static description = 'describe the command here'

  static examples = [`$ fab-static build ~/src/my-project/build`]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-o, --output=VALUE)
    output: flags.string({
      char: 'o',
      description: 'Output FAB file',
      default: 'fab-dist/fab.zip'
    }),
    'working-dir': flags.string({
      char: 'w',
      description: 'Intermediate directory for working',
      default: '.fab'
    }),
    'add-redirects': flags.string({
      char: 'r',
      description: 'Redirect a subdirectory of assets to _assets'
    })
  }

  static args = [
    {
      name: 'directory',
    }
  ]

  async run() {
    const { args, flags } = this.parse(Build)

    if (!args.directory) throw new Error("You must supply a directory to build")

    return await Builder.start(
      path.resolve(args.directory),
      path.resolve(flags.output!),
      path.resolve(flags['working-dir']!),
      flags['add-redirects']
    )
  }
}
