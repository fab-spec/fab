import { Command, flags } from '@oclif/command'
import { DEFAULT_CONFIG_FILENAME, FabActionsExports } from '@fab/core'
import { JSON5Config } from '../'
import { watcher } from '../helpers/watcher'

export default class Build extends Command {
  static description = 'Generate a FAB given the config (usually in fab.config.json5)'

  static examples = [
    `$ fab build`,
    `$ fab build --config=fab.config.json5`,
    `$ fab build --watch dist --watch fab.config.json5`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    config: flags.string({
      char: 'c',
      description: 'Path to config file',
      default: DEFAULT_CONFIG_FILENAME,
    }),
    'skip-cache': flags.boolean({
      description: 'Skip any caching of intermediate build artifacts',
    }),
    watch: flags.string({
      multiple: true,
      description:
        'Re-run the builder if any of the listed files change. Pass this argument multiple times to watch multiple files/directories.',
    }),
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Build)
    const { Builder } = require('@fab/actions').default as FabActionsExports

    await watcher(flags.watch, async () => {
      const config = await JSON5Config.readFrom(flags.config!)
      await Builder.build(flags.config, config.data, flags['skip-cache'])
    })
  }
}
