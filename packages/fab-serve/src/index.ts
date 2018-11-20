import { Command, flags } from '@oclif/command'

class FabServe extends Command {
  static description = 'Host a FAB in a local Express server'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    port: flags.string({
      description: 'Port to use',
      env: 'PORT',
      default: '3000'
    })
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(FabServe)
    const {port} = flags
    const { file } = args

    if (!file) {
      this.error(`You must provide a FAB file to run`)
    }

    this.log(`Serving ${file} on http://localhost:${port}`)
  }
}

export = FabServe
