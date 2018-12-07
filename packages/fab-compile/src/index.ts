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
    output: flags.string({
      char: 'o',
      description: 'Output FAB directory',
      default: '.fab/dist'
    }),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(FabCompile)
    const { input, output } = flags

    await Compiler.compile(input!, output!)
  }
}

export = FabCompile
