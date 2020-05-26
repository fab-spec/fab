import { FABRuntime } from '@fab/core'

export default ({ Router }: FABRuntime) => {
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
}
