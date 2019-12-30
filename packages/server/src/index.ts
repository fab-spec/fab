import ivm from 'isolated-vm'
import fs from 'fs-extra'

import { ServerArgs } from '@fab/core'
import { InvalidConfigError } from '@fab/cli'
import { readFilesFromZip } from './utils'

export default class Server {
  private filename: string
  private port: number

  constructor(filename: string, args: ServerArgs) {
    this.filename = filename
    this.port = parseInt(args.port)

    //  TODO: cert stuff

    if (isNaN(this.port)) {
      throw new InvalidConfigError(`Invalid port, expected a number, got '${args.port}'`)
    }
  }

  async serve() {
    if (!(await fs.pathExists(this.filename))) {
      throw new InvalidConfigError(`Could not find file '${this.filename}'`)
    }

    const files = await readFilesFromZip(this.filename)
    console.log(files)
  }
}
