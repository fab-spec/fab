import { FabCache, FabCacheValue } from '@fab/core'
import NodeCache from 'node-cache'
import Stream from 'stream'

export class Cache implements FabCache {
  private cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  async set(key: string, value: FabCacheValue, ttl_seconds?: number) {
    this.cache.set(
      key,
      await this.readAllIfStream(value),
      ttl_seconds || 0 /* unlimited */
    )
  }

  private async readAllIfStream(value: FabCacheValue) {
    if (typeof (value as ReadableStream).getReader === 'function') {
      const reader = (value as ReadableStream<string>).getReader()

      let chunk = await reader.read()
      let buffer = Buffer.from([])
      const enc = new TextEncoder()

      while (!chunk.done) {
        buffer = Buffer.concat([buffer, enc.encode(chunk.value)])
        chunk = await reader.read()
      }
      return buffer
    } else if (value instanceof Stream) {
      const chunks: Uint8Array[] = []
      return await new Promise((resolve, reject) => {
        value.on('data', (chunk) => chunks.push(chunk))
        value.on('error', reject)
        value.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      })
    }
    return value
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
