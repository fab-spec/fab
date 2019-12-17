import { RewireAssetsArgs, RewireAssetsMetadata } from './types'
import { FabPluginRuntime } from '@fab/core'

export const runtime: FabPluginRuntime<RewireAssetsArgs, RewireAssetsMetadata> = (
  args: RewireAssetsArgs,
  metadata: RewireAssetsMetadata
) => {
  const { inlined_assets, renamed_assets } = metadata.rewire_assets

  return async function({ url }) {
    console.log(url.pathname)
    if (inlined_assets[url.pathname]) {
      const { contents, content_type } = inlined_assets[url.pathname]
      return new Response(contents, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': content_type,
        },
      })
    }
    if (url.pathname === '/some-exact-path') {
      return new Response('OK', {
        status: 200,
      })
    }
    return undefined
  }
}
