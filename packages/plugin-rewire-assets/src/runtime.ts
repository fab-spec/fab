import { RewireAssetsMetadata } from './types'
import {
  FABRuntime,
  getCacheHeaders,
  matchPath,
  NON_IMMUTABLE_HEADERS,
  Priority,
} from '@fab/core'

export default function RewireAssetsRuntime({
  Router,
  Metadata,
}: FABRuntime<RewireAssetsMetadata>) {
  const { inlined_assets, renamed_assets } = Metadata.rewire_assets

  Router.onAll(async ({ url }) => {
    const { pathname } = url

    const inlined = matchPath(inlined_assets, pathname)
    if (inlined) {
      const { contents, content_type } = inlined
      return new Response(contents, {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': content_type,
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
        // The following lines ought to be removed, but something is causing a failure
        // with NextJS and this. I have a feeling it is related to the recent node-fetch
        // security update but haven't tracked it down yet.
        const body = await response.body
        return new Response(body, response)
      }
    }

    return undefined
  }, Priority.LAST)
}
