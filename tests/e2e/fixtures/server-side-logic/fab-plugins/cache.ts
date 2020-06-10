import { FABRuntime } from '@fab/core'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export default ({ Router, Cache }: FABRuntime) => {
  Router.on('/respond-slowly', async ({ url }) => {
    const response = await fetch(`${url.origin}/slowly`)
    return new Response(response.body, {
      headers: {
        'content-type': 'text/plain',
      },
    })
  })

  Router.on('/cache-slowly', async ({ url }) => {
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
    await Cache.set('cache-slow-response', stream)
    const cached_stream = await Cache.getStream('cache-slow-response')
    return new Response(cached_stream, {
      headers: {
        'content-type': 'text/plain',
      },
    })
  })
}
