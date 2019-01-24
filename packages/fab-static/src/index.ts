import { Command, flags } from '@oclif/command'
import * as path from 'path'
import * as fs from 'fs-extra'
import Builder from './Builder'
import { error, note, log } from './log'

class FabStatic extends Command {
  static description = 'describe the command here'

  static examples = [`$ fab-static ~/src/my-project/build`]

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
      description: 'Path to server entry file or directory'
    })
  }

  static args = [
    {
      name: 'directory'
    }
  ]

  async run() {
    const { args, flags } = this.parse(FabStatic)

    const config = await this.loadConfig(flags) || {}
    const merged_config = {
      directory: args.directory || config.directory,
      output: flags.output || config.output || 'fab.zip',
      working_dir: flags['working-dir'] || config.working_dir || '.fab',
      server: flags.server || config.server,
    }

    if (!merged_config.directory) {
      error(`You must supply a directory to build. E.g: fab-static build`)
      throw new Error('No directory supplied.')
    }

    return await Builder.start(merged_config)
  }

  private async loadConfig(flags: any) {
    const config_path = path.resolve(flags.config!)
    if (await fs.pathExists(config_path)) {
      try {
        return JSON.parse(await fs.readFile(config_path, 'utf8'))
      } catch (e) {
        error(`Error: ${flags.config} corrupt or invalid JSON.`)
        throw new Error('Config file parse error.')
      }
    } else {
      note(`Note: ${flags.config} doesn't exist. Using default config.`)
    }
  }
}

export = FabStatic
