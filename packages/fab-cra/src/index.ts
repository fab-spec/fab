import {Command, flags} from '@oclif/command'

class FabCreateReactApp extends Command {
  static description = 'describe the command here'

  static examples = [`$ fab-create-react-app`]

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: 'fab.config.json'
    }),
    output: flags.string({
      char: 'o',
      description: 'Output FAB file (default fab.zip)'
    }),
    'working-dir': flags.string({
      char: 'w',
      description: 'Intermediate directory for working (default .fab)',
    }),
    server: flags.string({
      char: 's',
      description: 'Path to server entry file'
    }),
    'prod-settings': flags.string({
      char: 'p',
      description: 'Path to production settings json'
    }),
    'intermediate-only': flags.boolean()
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(FabCreateReactApp)

    const name = flags.name || 'world'
    this.log(`hello ${name} from ./src/index.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}

export = FabCreateReactApp
