import { FABRuntime } from '@fab/core'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export default ({ Router, Cache }: FABRuntime) => {
  Router.on('/fetch-stream-through', async ({ url }) => {
    const response = await fetch(`${url.origin}/slowly`)
    return new Response(response.body)
  })

  Router.on('/stream-into-cache', async ({ url }) => {
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
    await Cache.set('stream-into-cache', stream)
    const cached_stream = await Cache.getStream('stream-into-cache')
    return new Response(cached_stream)
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
