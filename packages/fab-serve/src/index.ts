import * as fs from 'fs'
import { Command, flags } from '@oclif/command'
import Server from './Server'

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
      default: '3000',
      required: true,
    }),
    cert: flags.string({
      description: 'SSL certificate to use',
    }),
    key: flags.string({
      description: 'Key for the SSL Certificate',
    })
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(FabServe)
    const { port, cert, key } = flags
    const { file } = args

    if (!file) {
      this.error(`You must provide a FAB file to run`)
    }

    if ((key || cert) && !(key && cert)) {
      this.error('If you specificy either a key or cert, you must supply both')
    }
    const certContents = cert ? fs.readFileSync(cert) : undefined
    const keyContents = key ? fs.readFileSync(key) : undefined

    await Server.start(file, { port, cert: certContents, key: keyContents })

    const protocol = cert ? 'https' : 'http'

    this.log(`Serving ${file} on ${protocol}://localhost:${port}`)
  }
}

export = FabServe
