import { RewireAssetsArgs, RewireAssetsMetadata } from './types'
import { FabRenderer } from '@fab/core'

export const render: FabRenderer<RewireAssetsArgs, RewireAssetsMetadata> = (
  args: RewireAssetsArgs,
  metadata: RewireAssetsMetadata
) => {
  console.log('I am render time')

  async function respond(request: Request) {
    return new Response('OK', {
      status: 200,
    })
  }

  return function handle(request: Request) {
    if (request.url === '/some-exact-path') {
      return respond(request)
    }
    return undefined
  }
}
