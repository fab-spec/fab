/* Outermost FAB server, imports the plugin chain and responds to requests */

import {
  FabSettings,
  FabSpecRender,
  FabRenderer,
  PluginArgs,
  PluginMetadata,
} from '@fab/core'
// @ts-ignore
import { renderers } from 'user-defined-pipeline'
import { render as render_404 } from './404'

const pipeline = [
  ...(renderers as FabRenderer<PluginArgs, PluginMetadata>[]),
  render_404,
].map((middleware) => middleware({}, {}))

console.log(pipeline)

export const render: FabSpecRender = async (request: Request, settings: FabSettings) => {
  console.log(request.url)

  for (const responders of pipeline) {
    const response = responders(request, settings)
    if (response) {
      return response
    }
  }

  return new Response(`Error! Expected a plugin to respond!`, {
    status: 500,
    headers: {},
  })
}
