import { Command, flags } from '@oclif/command'
import {
  DEFAULT_CONFIG_FILENAME,
  SandboxType,
  ServerArgs,
  FabServerExports,
} from '@dev-spendesk/core'
import { loadOrInstallModule, _log } from '../helpers'
import fs from 'fs-extra'
const log = _log(`Server`)

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
    'auto-install': flags.boolean({
      description:
        'If you need dependent packages (e.g. @dev-spendesk/serve), install them without prompting',
    }),
    watch: flags.boolean({
      description:
        'EXPERIMENTAL: Watches fab.zip and restarts the server when it changes.',
    }),
    'proxy-ws': flags.string({
      description: 'EXPERIMENTAL: Proxy websocket requests to a different port',
    }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Serve)

    const { file: specified_file } = args
    const default_file = 'fab.zip'

    if (specified_file) {
      if (!(await fs.pathExists(specified_file))) {
        log.error(`ERROR: Cannot file find file '${specified_file}'.\n`)
        this._help()
      }
    } else if (!(await fs.pathExists(default_file))) {
      log.error(
        `ERROR: You must provide a FAB filename to serve, if '${default_file}' is not present in the current directory.\n`
      )
      this._help()
    }

    const file = specified_file || default_file

    log.announce(`fab serve`)
    const server_pkg = (
      await loadOrInstallModule(log, '@dev-spendesk/fab-server', flags['auto-install'])
    ).default as FabServerExports
    const server = server_pkg.createServer(file, flags as ServerArgs)
    await server.serve(
      flags['experimental-v8-sandbox'] ? SandboxType.v8isolate : SandboxType.nodeVm,
      flags.watch,
      flags['proxy-ws']
    )
  }
}
