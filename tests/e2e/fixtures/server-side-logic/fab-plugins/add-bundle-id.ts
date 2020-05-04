import { FABRuntime } from '@fab/core'

export default (Runtime: FABRuntime) => {
  Runtime.interceptResponse(async (response) => {
    response.headers.set('X-FAB-ID', 'TBD')
    return response
  })
}
