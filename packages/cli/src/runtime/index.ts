/* Outermost FAB server, imports the plugin chain and responds to requests */

import {
  FabSettings,
  FabSpecRender,
  FabPluginRuntime,
  FabMetadata,
  FabSpecMetadata,
} from '@fab/core'
import { render as render_404 } from './404'

/*
 * Here, we import "files" that are going to be injected by the Rollup build.
 * */

// @ts-ignore
import { runtimes } from 'user-defined-pipeline'
// @ts-ignore
import { fab_metadata } from 'fab-metadata'
// @ts-ignore
import { production_settings } from 'production-settings'
import { Directive, ResponseInterceptor } from '@fab/core'

const pipeline = [...(runtimes as FabPluginRuntime[]), render_404].map((runtime) =>
  runtime({}, (fab_metadata as FabMetadata).plugin_metadata)
)

export const render: FabSpecRender = async (request: Request, settings: FabSettings) => {
  const url = new URL(request.url)

  const response_interceptors: ResponseInterceptor[] = []
  const context: {[key: string]: any} = {}

  let chained_request = request

  for (const responders of pipeline) {
    const response = await responders({ request: chained_request.clone(), settings, url })
    if (!response) continue

    if (response instanceof Request) {
      return response
    }

    if (response instanceof Response) {
      let response_in_chain = response
      for (const interceptor of response_interceptors) {
        response_in_chain = await interceptor(response_in_chain)
      }
      return response_in_chain
    }

    // Really want to throw a meaningful exception if you return something
    // that isn't a "Directive", but that might be best done as a refactor
    // of the whole "sync function returns async responder" API...
    const directive = response as Directive
    if (typeof directive.interceptResponse === 'function') {
      // Unshift rather than push, so the reduce runs in the right order above.
      // I suppose I could use a library with a foldRight but I haven't.
      response_interceptors.unshift(directive.interceptResponse)
    }
    if (directive.replaceRequest instanceof Request) {
      chained_request = directive.replaceRequest
    }
  }

  return new Response(`Error! Expected a plugin to respond!`, {
    status: 500,
    headers: {},
  })
}

export const metadata: FabSpecMetadata = {
  production_settings,
}

/* Legacy support for env settings */
export const getProdSettings = () => {
  return metadata.production_settings
}
