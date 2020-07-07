import { FABRuntime } from '@fab/core'

export default ({ Router }: FABRuntime) => {
  Router.on('/hello/:whom?', async ({ params }) => {
    const { whom = 'world' } = params
    return new Response('HELLO ' + whom.toUpperCase() + '!\n', {
      status: 200,
    })
  })

  Router.on('/alt(/.*)?', async ({ request }) => {
    return {
      replaceRequest: new Request('/alternative.html', request),
    }
  })
}
