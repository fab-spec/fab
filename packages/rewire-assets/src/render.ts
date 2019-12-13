import { RewireAssetsArgs, RewireAssetsMetadata } from './types'
import { FabPluginRuntime } from '@fab/core'

export const render: FabPluginRuntime<RewireAssetsArgs, RewireAssetsMetadata> = (
  args: RewireAssetsArgs,
  metadata: RewireAssetsMetadata
) => {
  console.log('I am rewire assets render time')

  return async function({ url }) {
    if (url.pathname === '/some-exact-path') {
      return new Response('OK', {
        status: 200,
      })
    }
    return undefined
  }
}
