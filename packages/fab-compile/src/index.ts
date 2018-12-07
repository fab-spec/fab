import {Command, flags} from '@oclif/command'
import Compiler from './Compiler'

class FabCompile extends Command {
  static description = 'describe the command here'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'directory'}]

  async run() {
    const {args, flags} = this.parse(FabCompile)
    const { directory } = args

    await Compiler.compile(directory)
  }
}

export = FabCompile
