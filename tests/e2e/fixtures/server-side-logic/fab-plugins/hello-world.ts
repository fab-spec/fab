import { FABRuntime } from '@fab/core'

export default (Runtime: FABRuntime) => {
  Runtime.on('/hello/:whom?', async ({ params }) => {
    const { whom = 'world' } = params
    return new Response('HELLO ' + whom.toUpperCase() + '!\n', {
      status: 200,
    })
  })
}
