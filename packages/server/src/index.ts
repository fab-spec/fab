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

    const g = context.global
    await g.set('global', g.derefInto())

    await context.evalClosure(
      `
      global.console = {
        log(...args) {
          $0.getSync('log').applyIgnored($0, args, { arguments: { copy: true } });
        }
      }
      `,
      [console],
      // @ts-ignore
      { arguments: { reference: true } }
    )

    const flyV8 = await fs.readFile(require.resolve('@fly/v8env/dist/v8env.js'), 'utf8')
    // console.log(flyV8)
    const script = await isolate.compileScript(`
      ${flyV8};
      iife = ${src};
      function FAB_render(...args) {
        console.log(JSON.stringify(Object.keys(iife)))
        return bridge.wrapValue(iife.isEverythingOk(...args))
      }
    `)

    console.log({ script })
    const retval = await script.run(context)
    console.log({ retval })

    const bootstrapBridge = await g.get('bootstrapBridge')
    await bootstrapBridge.apply(null, [
      ivm,
      new ivm.Reference((name: string, ...args: any[]) => {
        console.log(`[BRIDGE DISPATCH] ${name}`)
        console.log(...args)
      }),
    ])
    const bootstrap = await g.get('bootstrap')
    await bootstrap.apply()

    await context.eval(`console.log(JSON.stringify(Object.keys(global)))`)
    await context.eval(`console.log(JSON.stringify(Object.keys(global.fly)))`)
    await context.eval(`console.log(JSON.stringify(Object.keys(global.fly.http)))`)
    await context.eval(`console.log(JSON.stringify(Object.keys(iife)))`)

    const iifeRef = await g.get('iife')
    console.log({ iifeRef })
    const renderRef = await g.get('FAB_render')
    console.log({ renderRef })
    console.log(await renderRef.apply(undefined))
  }
}
