import { PluginArgs, PluginMetadata, FabPluginRuntime } from '@fab/core'

export const render: FabPluginRuntime<PluginArgs, PluginMetadata> = (
  args: PluginArgs,
  metadata: PluginMetadata
) => {
  return async function({ url }) {
    // Usually, a middleware will respond only in some circumstance,
    // but in our case, since we're always the last to be called,
    // we always respond.

    // if (weDontHandleThis(url.pathname)) return undefined

    return new Response(`No resource found at ${url.pathname}.`, {
      status: 404,
      statusText: 'Not Found',
      headers: {},
    })
  }
}
