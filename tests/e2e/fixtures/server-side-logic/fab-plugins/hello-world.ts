import { FABRuntime } from '@fab/core'

export default (Runtime: FABRuntime) => {
  Runtime.matches('/hello/:whom?', async ({ whom = 'world' }) => {
    return new Response('HELLO ' + whom.toUpperCase() + '!\n', {
      status: 200,
    })
  })
}
