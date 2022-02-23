import { FABRuntime } from '@dev-spendesk/fab-core'

const redirects = {
  '/kb/plugins': '/plugins/introduction',
  '/guides/18-05-2020-why-frontend-bundles': '/blog/18-05-2020-why-frontend-bundles',
}

export default ({ Router, Cache }: FABRuntime) => {
  for (const [from, to] of Object.entries(redirects)) {
    Router.on(
      from,
      async () =>
        new Response(null, {
          status: 301,
          headers: {
            Location: to,
          },
        })
    )
  }

  Router.on('/cache-test', async () => {
    const n = (await Cache.getNumber('cache-test')) || 0
    await Cache.set('cache-test', n + 1)
    return new Response(`This page has been called ${n + 1} times.\n`)
  })
}
