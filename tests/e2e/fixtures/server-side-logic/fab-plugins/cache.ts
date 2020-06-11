import { FABRuntime } from '@fab/core'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export default ({ Router, Cache }: FABRuntime) => {
  Router.on('/return-fetch', async ({ url }) => {
    return await fetch(`${url.origin}/slowly`)
  })

  Router.on('/fetch-return-body', async ({ url }) => {
    const response = await fetch(`${url.origin}/slowly`)
    return new Response(response.body)
  })

  Router.on('/fetch-await-body', async ({ url }) => {
    const response = await fetch(`${url.origin}/slowly`)
    return new Response(await response.text())
  })

  async function streamIntoCache(key: string) {
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue('Des\n')
        await sleep(500)
        controller.enqueue('pa\n')
        await sleep(500)
        controller.enqueue('cito.\n')
        controller.close()
      },
    })
    await Cache.set(key, stream)
  }

  Router.on('/cache-stream-return-buffer', async () => {
    await streamIntoCache('cache-stream-return-buffer')
    return new Response(await Cache.getArrayBuffer('cache-stream-return-buffer'))
  })

  Router.on('/cache-stream-return-stream', async () => {
    await streamIntoCache('cache-stream-return-stream')
    return new Response(await Cache.getStream('cache-stream-return-stream'))
  })

  Router.on('/fetch-cache-serve', async ({ url }) => {
    const response = await fetch(`${url.origin}/slowly`)
    await Cache.set('fetch-cache-serve', response.body!)
    const cached_stream = await Cache.getStream('fetch-cache-serve')
    return new Response(cached_stream)
  })

  Router.on('/fetch-cache-accum-send', async ({ url }) => {
    const response = await fetch(`${url.origin}/slowly`)
    await Cache.set('fetch-cache-stream', response.body!)
    const cached_stream = await Cache.getStream('fetch-cache-stream')

    const reader = cached_stream!.getReader()

    let chunk = await reader.read()
    let buffer = ''

    while (!chunk.done) {
      buffer += chunk.value
      chunk = await reader.read()
    }
    return new Response(buffer)
  })
}
