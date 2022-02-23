import { FABRuntime } from '@dev-spendesk/core'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export default ({ Router }: FABRuntime) => {
  Router.on('/slowly', async () => {
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

    return new Response(stream, {
      headers: {
        'content-type': 'text/plain',
      },
    })
  })
}
