import {Command, flags} from '@oclif/command'
import Compiler from './Compiler'

class FabCompile extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    input: flags.string({
      char: 'i',
      description: 'Intermediate FAB directory',
      default: '.fab/intermediate'
    }),
    'build-dir': flags.string({
      char: 'b',
      description: 'Working FAB directory',
      default: '.fab/build'
    }),
    output: flags.string({
      char: 'o',
      description: 'Output FAB file',
      default: 'fab.zip'
    }),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(FabCompile)
    const { input, output } = flags

    await Compiler.compile(input!, flags['build-dir']!, output!)
  }
}

export = FabCompile
