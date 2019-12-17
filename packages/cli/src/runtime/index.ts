/* Outermost FAB server, imports the plugin chain and responds to requests */

import {
  FabSettings,
  FabSpecRender,
  FabPluginRuntime,
  PluginArgs,
  PluginMetadata,
  FabMetadata,
} from '@fab/core'
// @ts-ignore
import { renderers } from 'user-defined-pipeline'
// @ts-ignore
import { fab_metadata } from 'fab-metadata'
import { render as render_404 } from './404'

const pipeline = [
  ...(renderers as FabPluginRuntime<PluginArgs, PluginMetadata>[]),
  render_404,
].map((middleware) => middleware({}, (fab_metadata as FabMetadata).plugin_metadata))

console.log(pipeline)

export const render: FabSpecRender = async (request: Request, settings: FabSettings) => {
  const url = new URL(request.url)

  for (const responders of pipeline) {
    const response = await responders({ request, settings, url })
    if (response) {
      return response
    }
  }

  return new Response(`Error! Expected a plugin to respond!`, {
    status: 500,
    headers: {},
  })
}
