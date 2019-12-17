import { log } from '../helpers'

export class InvalidConfigError extends Error {
  constructor(explanation: string) {
    super(explanation)

    log.error(`Config file contains errors!`)
  }
}
