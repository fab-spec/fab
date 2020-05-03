import { RewireAssetsMetadata } from './types'
import { FABRuntime, getCacheHeaders, matchPath, NON_IMMUTABLE_HEADERS } from '@fab/core'

export default function RewireAssetsRuntime(Runtime: FABRuntime<RewireAssetsMetadata>) {
  const { inlined_assets, renamed_assets } = Runtime.metadata.rewire_assets

  Runtime.onAll(async ({ url }) => {
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
      if (renamed.immutable) {
        return new Request(renamed.asset_path)
      } else {
        const response = await fetch(renamed.asset_path)
        Object.entries(NON_IMMUTABLE_HEADERS).forEach(([k, v]) =>
          response.headers.set(k, v)
        )
        return response
      }
    }

    return undefined
  })
}
