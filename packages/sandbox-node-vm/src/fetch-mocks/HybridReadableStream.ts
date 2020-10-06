/*
 * We're using node-fetch under the hood, which has a hard-coded check on the body:
 *   response.body instanceof Stream
 * this means that our Web Streams ReadableStream gets .toString()-ed, which breaks.
 * This lets FAB users use ReadableStream as if it was on the web, but this Node VM
 * (which will be replaced by the V8::Isolate-based VM) can trick node-fetch into
 * doing what we want. See https://github.com/node-fetch/node-fetch/pull/848
 *
 * */
import { ReadableStream as WebReadableStream } from 'web-streams-polyfill/es2018'
import Stream from 'stream'

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
