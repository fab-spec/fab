import { FABRuntime } from '@fab/core'

export default ({ Router, Cache }: FABRuntime, args: { port: number }) => {
  Router.onAll(async ({ request }) => {
    const proxied_url = new URL(request.url)
    proxied_url.host = `localhost:${args.port}`
    const proxied = new Request(proxied_url.href, request)
    return fetch(proxied)
  })
}
