import { log } from '../helpers'

export class BuildFailedError extends Error {
  constructor(message: string) {
    super(`Build failed!`)

    log(`❤️Build failed!❤️\n\n${message}`)
  }
}
