import vm from 'vm'
import * as fetch from 'node-fetch'
import { FabSpecExports } from '@fab/core'
import Stream from 'stream'
import { ReadableStream as WebReadableStream } from 'web-streams-polyfill/ponyfill/es2018'

/*
 * We're using node-fetch under the hood, which has a hard-coded check on the body:
 *   response.body instanceof Stream
 * this means that our Web Streams ReadableStream gets .toString()-ed, which breaks.
 * This lets FAB users use ReadableStream as if it was on the web, but this Node VM
 * (which will be replaced by the V8::Isolate-based VM) can trick node-fetch into
 * doing what we want. See https://github.com/node-fetch/node-fetch/pull/848
 *
 * */
export function HybridReadableStream(...args: any[]) {
  const readableStream = new WebReadableStream(...args)
  return new Proxy(readableStream, {
    getPrototypeOf() {
      return Stream.Readable.prototype
    },
    get(target, prop, receiver) {
      if (prop === 'on') return () => {}
      return Reflect.get(target, prop, receiver)
    },
  })
}

export default async (src: string, enhanced_fetch: any): Promise<FabSpecExports> => {
  const sandbox = {
    fetch: enhanced_fetch,
    Request: fetch.Request,
    Response: fetch.Response,
    Headers: fetch.Headers,
    URL: URL,
    ReadableStream: HybridReadableStream,
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
