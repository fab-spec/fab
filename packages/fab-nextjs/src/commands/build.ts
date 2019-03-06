import { Command, flags } from '@oclif/command'
import Builder from '../Builder'
import * as path from 'path'
import * as fs from 'fs-extra'
import { error, log } from '../utils'
import chalk from 'chalk'

export default class Build extends Command {
  static description = 'Build a NextJS project into a FAB'

  static examples = [
    `$ fab-nextjs build`,
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
