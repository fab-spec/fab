import { RewireAssetsMetadata } from './types'
import {
  FABRuntime,
  getCacheHeaders,
  matchPath,
  NON_IMMUTABLE_HEADERS,
  Priority,
} from '@dev-spendesk/core'

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
      const { chunks_paths, immutable } = renamed
      if (chunks_paths.length === 1) {
        const asset_path = chunks_paths[0]
        if (immutable) {
          return new Request(asset_path)
        } else {
          const response = await fetch(asset_path)
          Object.entries(NON_IMMUTABLE_HEADERS).forEach(([k, v]) =>
            response.headers.set(k, v)
          )
          return response
        }
      } else {
        // If there are many chunks, we might want to limit parallelism
        const responses = await Promise.all(
          chunks_paths.map(async (chunk_path) => {
            return fetch(chunk_path)
          })
        )
        const concatenated_body = concatenateReadableStreams(
          responses.map((response) => response.body)
        )
        return new Response(concatenated_body, {
          status: 200,
          statusText: 'OK',
          headers: getCacheHeaders(immutable),
        })
      }
    }

    return undefined
  }, Priority.LAST)
}

function concatenateReadableStreams<T>(
  streams: (ReadableStream<T> | null)[]
): ReadableStream<T> {
  return new ReadableStream({
    async start(controller) {
      for (const stream of streams) {
        if (!stream) {
          continue
        }
        const reader = stream.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          if (value !== undefined) {
            controller.enqueue(value)
          }
        }
        reader.releaseLock()
      }
      controller.close()
    },
  })
}
