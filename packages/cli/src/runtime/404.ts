import { PluginArgs, PluginMetadata, FabRenderer } from '@fab/core'

export const render: FabRenderer<PluginArgs, PluginMetadata> = (
  args: PluginArgs,
  metadata: PluginMetadata
) => {
  async function respond(request: Request) {
    return new Response(null, {
      status: 404,
      statusText: 'Not Found',
      headers: {},
    })
  }

  return function handle(request: Request) {
    // Usually, a middleware will respond only in some circumstance,
    // but in our case, since we're always the last to be called,
    // we always respond.

    // if (request.url === '/some-exact-path') {
    return respond(request)
    // }
    // return undefined
  }
}
