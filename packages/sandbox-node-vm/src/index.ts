import vm from 'vm'
import * as fetch from 'cross-fetch'
import { FabSpecExports } from '@fab/core'
import * as FetchMocks from './fetch-mocks'

export default async (src: string, enhanced_fetch: any): Promise<FabSpecExports> => {
  const sandbox = {
    fetch: enhanced_fetch,
    Request: fetch.Request,
    Response: fetch.Response,
    Headers: fetch.Headers,
    URL: URL,
    ReadableStream: FetchMocks.HybridReadableStream,
    console: {
      log: console.log,
      error: console.error,
      warn: console.warn,
    },
    NODE_ENV: 'production',
    process: {
      env: {
        NODE_ENV: 'production',
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
  const renderer = Object.assign({}, exp, retval)
  return { renderer, fetch: enhanced_fetch }
}
