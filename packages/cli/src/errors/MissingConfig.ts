import * as path from 'path'
import { DEFAULT_CONFIG_FILENAME } from '@dev-spendesk/fab-core'
import { log } from '../helpers'

export class MissingConfig extends Error {
  constructor(file_path: string) {
    super(`Missing config file at '${file_path}'`)

    // This may need to change, this naively assumes that creating this object
    // means that things have gone pear shaped (fairly reasonable), and that
    // the right way to log out is just by calling global console.log (maybe less so)
    if (file_path === DEFAULT_CONFIG_FILENAME) {
      log.error(`
ERROR: No config file found.

All FAB tooling assumes that you have a valid config file (by default, 'fab.config.json5' in the current working directory.
Either use the --config argument to point to a different file or run the following command to generate one:

  fab init
`)
    } else {
      log.error(`
Config file '${file_path}' not found.
Looked for file at '${path.resolve(file_path)}' but it didn't exist.
Maybe you need to run 'fab init', or you're running in the wrong directory?
`)
    }
  }
}
