import { log } from '../helpers'

export class InvalidConfigError extends Error {
  constructor(explanation: string) {
    super(`Config file contains errors!`)

    log.error(`ERROR: Problem with config file.\n\n${explanation}\n`)
  }
}
