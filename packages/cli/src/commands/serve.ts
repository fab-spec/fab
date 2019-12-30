import { Command, flags } from '@oclif/command'
import { InvalidConfigError } from '../errors'
import { ServerArgs } from '@fab/core'

export default class Serve extends Command {
  static description = 'Serve a FAB in a local NodeJS Express server'

  static examples = [
    `$ fab serve fab.zip`,
    `$ fab serve --port=3001 fab.zip`,
    `$ fab serve --cert=local-ssl.cert --key=local-ssl.key fab.zip`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
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
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Serve)
    const Server = this.requireServer()
    if (!Server)
      throw new InvalidConfigError(
        `Something went wrong requiring @fab/server. It had no default export.`
      )

    const server = new Server(args.file, flags as ServerArgs)
    await server.serve()
  }

  requireServer() {
    try {
      return require('@fab/server').default
    } catch (e) {
      throw new InvalidConfigError(`Cannot find @fab/server. You need to install it.`)
    }
  }
}
