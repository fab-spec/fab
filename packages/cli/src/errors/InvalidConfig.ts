import { log } from '../helpers'

export class InvalidConfigError extends Error {
  constructor(explanation: string, e?: Error) {
    super(`Config file contains errors!`)

    if (e) console.log(e)
    log(`❤️ERROR: Problem with config file.❤️\n\n${explanation}\n`)
  }
}
