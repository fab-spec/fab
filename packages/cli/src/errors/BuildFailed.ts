import { log } from '../helpers'

export class BuildFailedError extends Error {
  constructor(message: string) {
    super(`Build failed!`)

    log.error(`Build failed!\n\n${message}`)
  }
}
