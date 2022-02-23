import { FABRuntime, Priority } from '@dev-spendesk/fab-core'

export default ({ Router }: FABRuntime) => {
  Router.on('/hello/:whom?', async ({ params }) => {
    const { whom = 'world' } = params
    return new Response('HELLO ' + whom.toUpperCase() + '!\n', {
      status: 200,
    })
  })

  Router.on(
    '/alt(/.*)?',
    async ({ url, request }) => {
      return {
        replaceRequest: new Request(`${url.origin}/alternative.html`, request),
      }
    },
    Priority.FIRST
  )

  Router.on(
    '/mutate-url-doesnt-work',
    async ({ url }) => {
      url.pathname = '/alternative.html'
      return undefined
    },
    Priority.FIRST
  )
}
