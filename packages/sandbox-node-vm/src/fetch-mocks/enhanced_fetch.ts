import fetch from 'cross-fetch'
import { FetchApi } from '@fab/core'

export const enhanced_fetch: FetchApi = async (url, init?) => {
  const request_url = typeof url === 'string' ? url : url.url
  const response = await fetch(
    request_url.startsWith('/')
      ? // Need a smarter wau to re-enter the FAB, eventually...
        `http://localhost:${this.port}${request_url}`
      : url,
    init
  )
  return Object.create(response, {
    body: {
      value: Object.create(response.body, {
        getReader: {
          get() {
            const webStream = nodeToWebStream(response.body)
            return webStream.getReader.bind(webStream)
          },
        },
      }),
    },
  })
}
