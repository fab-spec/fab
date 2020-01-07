import ivm from 'isolated-vm'
import fs from 'fs-extra'

import { ServerArgs, RuntimeType } from '@fab/core'
import { InvalidConfigError } from '@fab/cli'
import { readFilesFromZip } from './utils'
import v8runtime from './runtimes/v8-isolate'
import nodeVmRuntime from './runtimes/node-vm'

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

  async serve(runtimeType: RuntimeType) {
    if (!(await fs.pathExists(this.filename))) {
      throw new InvalidConfigError(`Could not find file '${this.filename}'`)
    }

    const files = await readFilesFromZip(this.filename)
    console.log(files)

    const src_buffer = files['/server.js']
    if (!src_buffer) {
      throw new InvalidConfigError('Malformed FAB. Missing /server.js')
    }
    const src = src_buffer.toString('utf8')

    const runtime =
      runtimeType === RuntimeType.v8isolate ? v8runtime(src) : nodeVmRuntime(src)
  }
}
