import { RewireAssetsArgs, RewireAssetsMetadata } from './types'
import { FabPluginRuntime, getCacheHeaders, matchPath } from '@fab/core'

export const runtime: FabPluginRuntime<RewireAssetsArgs, RewireAssetsMetadata> = (
  args: RewireAssetsArgs,
  metadata: RewireAssetsMetadata
) => {
  const { inlined_assets, renamed_assets } = metadata.rewire_assets
  console.log(inlined_assets)
  console.log(renamed_assets)

  return async function({ url }) {
    const { pathname } = url

    const inlined = matchPath(inlined_assets, pathname)
    if (inlined) {
      const { contents, content_type } = inlined
      return new Response(contents, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': content_type,
          ...getCacheHeaders(inlined.immutable),
        },
      })
    }

    const renamed = matchPath(renamed_assets, pathname)
    if (renamed) {
      return new Response(null, {
        status: 302,
        statusText: 'Found',
        headers: {
          Location: renamed.asset_path,
          ...getCacheHeaders(renamed.immutable),
        },
      })
    }
    return undefined
  }
}
