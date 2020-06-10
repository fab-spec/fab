import { FabCache, FabCacheValue } from '@fab/core'
import NodeCache from 'node-cache'
export class Cache implements FabCache {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  async set(key: string, value: FabCacheValue, ttl_seconds?: number) {
    console.log()
    if (typeof (value as ReadableStream).getReader === 'function') {
      const reader = (value as ReadableStream<string>).getReader()

      let chunk = await reader.read()
      let buffer = Buffer.from([])
      const enc = new TextEncoder()

      while (!chunk.done) {
        buffer = Buffer.concat([buffer, enc.encode(chunk.value)])
        chunk = await reader.read()
      }
      this.cache.set(key, buffer, ttl_seconds || 0 /* unlimited */)
    } else {
      this.cache.set(key, value, ttl_seconds || 0 /* unlimited */)
    }
  }

  async setJSON(key: string, value: any, ttl_seconds?: number) {
    await this.set(key, JSON.stringify(value), ttl_seconds)
  }

  async get(key: string) {
    return this.cache.get<string>(key)
  }

  async getJSON(key: string) {
    const val = await this.get(key)
    return val && JSON.parse(val)
  }

  async getArrayBuffer(key: string) {
    return this.cache.get<ArrayBuffer>(key)
  }

  async getNumber(key: string) {
    return this.cache.get<number>(key)
  }

  async getStream(key: string) {
    // todo: create a new stream from the stored object to stream it out
    return this.cache.get<ReadableStream>(key)
  }
}
