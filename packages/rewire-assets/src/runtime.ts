import { RewireAssetsArgs, RewireAssetsMetadata } from './types'
import { FabPluginRuntime } from '@fab/core'

export const runtime: FabPluginRuntime<RewireAssetsArgs, RewireAssetsMetadata> = (
  args: RewireAssetsArgs,
  metadata: RewireAssetsMetadata
) => {
  const { inlined_assets, renamed_assets } = metadata.rewire_assets
  console.log(inlined_assets)
  console.log(renamed_assets)

  return async function({ url }) {
    const { pathname } = url

    if (inlined_assets[pathname]) {
      const { contents, content_type } = inlined_assets[pathname]
      return new Response(contents, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': content_type,
        },
      })
    }

    if (renamed_assets[pathname]) {
      return new Response(null, {
        status: 302,
        statusText: 'Found',
        headers: {
          Location: renamed_assets[pathname].asset_path,
        },
      })
    }
    return undefined
  }
}
