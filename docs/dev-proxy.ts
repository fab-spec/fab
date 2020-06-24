import { FABRuntime } from '@fab/core'

type Args = {
  env_flag?: string
  port?: number
}

export default ({ Router, Cache }: FABRuntime, args: Args = {}) => {
  const { env_flag = 'DEV_PROXY', port } = args
  if (!port) return console.log(`Missing 'port' arg for dev-proxy. Skipping.`)

  Router.onAll(async ({ request, settings }) => {
    if (!settings[env_flag]) return undefined

    const proxied_url = new URL(request.url)
    proxied_url.host = `localhost:${args.port}`
    const proxied = new Request(proxied_url.href, request)
    return fetch(proxied)
  })
}
