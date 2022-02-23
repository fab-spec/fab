import { FABRuntime } from '@dev-spendesk/core'

export default ({ Router, ServerContext }: FABRuntime) => {
  Router.interceptResponse(async (response) => {
    response.headers.set('X-FAB-ID', ServerContext.bundle_id)
    return response
  })
}
