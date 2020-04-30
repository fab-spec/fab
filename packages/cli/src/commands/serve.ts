import { Command, flags } from '@oclif/command'
import {
  DEFAULT_CONFIG_FILENAME,
  SandboxType,
  ServerArgs,
  FabServerExports,
} from '@fab/core'
import { log } from '../helpers'

export default class Serve extends Command {
  static description = 'fab serve: Serve a FAB in a local NodeJS Express server'

  static examples = [
    `$ fab serve fab.zip`,
    `$ fab serve --port=3001 fab.zip`,
    `$ fab serve --cert=local-ssl.cert --key=local-ssl.key fab.zip`,
    `$ fab serve --env=staging fab.zip`,
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
    'experimental-v8-sandbox': flags.boolean({
      description:
        'Enable experimental V8::Isolate Runtime (in development, currently non-functional)',
    }),
    env: flags.string({
      description:
        'Override production settings with a different environment defined in your FAB config file.',
    }),
    config: flags.string({
      char: 'c',
      description:
        'Path to config file. Only used for SETTINGS in conjunction with --env.',
      default: DEFAULT_CONFIG_FILENAME,
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Serve)

    const { file } = args
    if (!file) {
      log.error('ERROR: You must provide a FAB filename to serve.\n')
      this._help()
    }
    const server_pkg = require('@fab/server').default as FabServerExports
    const server = server_pkg.createServer(file, flags as ServerArgs)
    await server.serve(
      flags['experimental-v8-sandbox'] ? SandboxType.v8isolate : SandboxType.nodeVm
    )
  }
}
