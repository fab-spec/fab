import { FABRuntime, NO_RESPONSE_STATUS_CODE, Priority } from '@fab/core'

export default function FinalResponder({ Router }: FABRuntime) {
  Router.onAll(async ({ url }) => {
    // We're the last middleware to be called, and so we:
    //   a) always respond
    //   b) return a status 444 No Response
    //
    // We assume that this 444 will be picked up by a previous middleware's
    // interceptResponse directive, and turned into a meaningful 404.
    return new Response(`No resource found at ${url.pathname}\n`, {
      status: NO_RESPONSE_STATUS_CODE,
      statusText: 'No Response',
      headers: {},
    })
  }, Priority.LAST)
}
