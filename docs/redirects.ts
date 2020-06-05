import { FABRuntime } from '@fab/core'

export default ({ Router, Cache }: FABRuntime) => {
  Router.on(
    '/guides/18-05-2020-why-frontend-bundles',
    async () =>
      new Response(null, {
        status: 301,
        headers: {
          Location: '/blog/18-05-2020-why-frontend-bundles',
        },
      })
  )

  Router.on('/cache-test', async () => {
    const n = (await Cache.getNumber('cache-test')) || 0
    await Cache.set('cache-test', n + 1)
    return new Response(`This page has been called ${n + 1} times.\n`)
  })
}
