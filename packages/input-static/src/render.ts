import { InputStaticArgs, InputStaticMetadata } from './types'
import { FabPluginRuntime } from '@fab/core'

export const render: FabPluginRuntime<InputStaticArgs, InputStaticMetadata> = (
  args: InputStaticArgs,
  metadata: InputStaticMetadata
) => {
  console.log('I am input-static render time')

  return async function({ url }) {
    if (url.pathname === '/some-exact-path') {
      return new Response('OK', {
        status: 200,
      })
    }
    return undefined
  }
}
