import { FABRuntime } from '@fab/core'

export default ({ Router, Cache }: FABRuntime) => {
  Router.on('/cache-slowly', async ({ url }) => {
    const response = await fetch(`${url.origin}/slowly`)
    const body = await response.text()
    return new Response(body, {
      headers: {
        'content-type': 'text/plain',
      },
    })
  })
}
