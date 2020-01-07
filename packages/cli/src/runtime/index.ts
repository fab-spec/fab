/* Outermost FAB server, imports the plugin chain and responds to requests */

import {
  FabSettings,
  FabSpecRender,
  FabPluginRuntime,
  PluginArgs,
  PluginMetadata,
  FabMetadata,
  FabSpecGetSettings,
} from '@fab/core'
import { render as render_404 } from './404'

/*
 * Here, we import "files" that are going to be injected by the Rollup build.
 * */

// @ts-ignore
import { runtimes } from 'user-defined-pipeline'
// @ts-ignore
import { fab_metadata } from 'fab-metadata'

const pipeline = [
  ...(runtimes as FabPluginRuntime<PluginArgs, PluginMetadata>[]),
  render_404,
].map((runtime) => runtime({}, (fab_metadata as FabMetadata).plugin_metadata))

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

export const getSettings: FabSpecGetSettings = (env: string) => {
  return {}
}
