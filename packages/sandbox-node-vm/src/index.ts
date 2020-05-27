import vm from 'vm'
import * as fetch from 'cross-fetch'
import { FabSpecExports, FetchApi } from '@fab/core'
// @ts-ignore
import { ReadableStream } from 'web-streams-ponyfill'

export default async (src: string, enhanced_fetch: any): Promise<FabSpecExports> => {
  const sandbox = {
    fetch: enhanced_fetch,
    Request: fetch.Request,
    Response: fetch.Response,
    Headers: fetch.Headers,
    URL: URL,
    ReadableStream,
    console: {
      log: console.log,
      error: console.error,
    },
    NODE_ENV: 'server',
    process: {
      env: {
        NODE_ENV: 'server',
      },
    },
    setTimeout,
    setImmediate,
    clearTimeout,
  }

  const script = new vm.Script(src)
  const exp: any = {}
  const ctx = Object.assign({}, sandbox, { module: { exports: exp }, exports: exp })
  const retval = script.runInNewContext(ctx)
  return Object.assign({}, exp, retval)
}
