import { Command, flags } from '@oclif/command'
import Builder from '../Builder'
import * as path from 'path'

export default class Build extends Command {
  static description = 'describe the command here'

  static examples = [`$ fab-static build ~/src/my-project/build`]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-o, --output=VALUE)
    output: flags.string({
      char: 'o',
      description: 'Output FAB file',
      default: 'fab-dist/fab.zip'
    }),
    'working-dir': flags.string({
      char: 'w',
      description: 'Intermediate directory for working',
      default: '.fab'
    }),
    'add-redirects': flags.string({
      char: 'r',
      description: 'Redirect a subdirectory of assets to _assets'
    })
  }

  static args = [
    {
      name: 'directory'
    }
  ]

  async run() {
    const { args, flags } = this.parse(Build)

    if (!args.directory) throw new Error('You must supply a directory to build')

    if (flags['add-redirects'])
      throw new Error(`We don't support redirects yet, sorry.`)

    return await Builder.start(
      path.resolve(args.directory),
      path.resolve(flags.output!),
      path.resolve(flags['working-dir']!),
      flags['add-redirects']
    )

    /*

    STATIC PART

    - loads all the HTML templates
    - compiles them into an intermediate format for runtime injection
    - generates server/htmls.js with them inlined (or 'required' and webpack will do it)
    - compiles them into server.js with a handler for injecting
      - Runtime variables
      - HTTP headers


    Output structure:

    - /_assets/*         (already fingerprinted, good to go)
    - /_server/index.js  (about to be wrapped & webpacked)
    - /_server/*         (any files referenced by index.js go here)
    - /*                 (all extra files get shunted around)

    COMPILE PART

    - Move any non /_asset or server.js files into _assets
    - Fingerprint them
    - Record a manifest of /favicon.ico -> /_assets/favicon.a1b2c3d4.ico
    - Wrap server.js in a handler that checks the manifest and rewrites
      - The handler needs to specify cache headers

    */
  }
}
