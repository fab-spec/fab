import ivm from 'isolated-vm'
import fs from 'fs-extra'
import fetch, { Request, Response, Headers } from 'node-fetch'

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

    const src_buffer = files['/server.js']
    if (!src_buffer) {
      throw new InvalidConfigError('Malformed FAB. Missing /server.js')
    }
    const src = src_buffer.toString('utf8')

    const isolate = new ivm.Isolate({ memoryLimit: 128 })
    const context = await isolate.createContext()
    console.log({ context })

    const jail = context.global
    await jail.set('global', jail.derefInto())

    await context.evalClosure(
      `global.console = {
      log(...args) {
        $0.getSync('log').applyIgnored($0, args, { arguments: { copy: true } });
      }
    }`,
      // @ts-ignore
      [console],
      { arguments: { reference: true } }
    )

    const globals = {
      // fetch: fetch,
      // Request: Request,
      Response: Response,
      // Headers: Headers,
      // URL: URL,
      // console: {
      //   log: console.log,
      //   error: console.error,
      // },
      // NODE_ENV: 'server',
      // process: {
      //   env: {
      //     NODE_ENV: 'server',
      //   },
      // },
      // setTimeout,
      // setImmediate,
      // clearTimeout,
    }
    for (const [key, val] of Object.entries(globals)) {
      // await context.global.set(key, val)
    }

    const script = await isolate.compileScript('iife = ' + src)
    console.log({ script })
    const retval = await script.run(context)
    console.log({ retval })
    const iifeRef = await context.global.get('iife')
    console.log({ iifeRef })
    const renderRef = await iifeRef.get('isEverythingOk')
    console.log({ renderRef })
    console.log(await renderRef.apply(undefined))
  }
}
