import { Command, flags } from '@oclif/command'
import { DEFAULT_CONFIG_FILENAME, FabActionsExports } from '@fab/core'
import { JSON5Config } from '../'
import chokidar from 'chokidar'

export default class Build extends Command {
  static description = 'Generate a FAB given the config (usually in fab.config.json5)'

  static examples = [`$ fab build`, `$ fab build --config=fab.config.json5`]

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
    }),
  }

  static args = []

  async run() {
    const { args, flags } = this.parse(Build)
    const config = await JSON5Config.readFrom(flags.config!)
    const { Builder } = require('@fab/actions').default as FabActionsExports
    const watch = flags.watch || []

    const build = async () => {
      await Builder.build(flags.config, config.data, flags['skip-cache'])
    }

    if (watch.length > 0) {
      let building = false

      const rebuild = async (message: string) => {
        if (building) return
        building = true
        console.clear()
        console.log(message)
        await build()
        building = false
      }

      rebuild(`Watching paths: ${watch.join(' ')}`)
      chokidar.watch(watch).on('ready', () => {
        chokidar.watch(watch).on('all', (event, path) => {
          rebuild(`${path} changed`)
        })
      })
    } else {
      await build()
    }
  }
}
