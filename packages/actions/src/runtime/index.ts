/* Outermost FAB server, imports the plugin chain and responds to requests */

import {
  FabSettings,
  FabSpecRender,
  FabPluginRuntime,
  FabMetadata,
  FabSpecMetadata,
  NO_RESPONSE_STATUS_CODE,
} from '@fab/core'
import final_responder from './final_responder'

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
import { FABRuntime } from '@fab/core/runtime'

FABRuntime.initialize(fab_metadata, [
  ...(runtimes as FabPluginRuntime[]),
  final_responder,
])

export const render: FabSpecRender = async (request: Request, settings: FabSettings) => {
  const url = new URL(request.url)

  // If no middleware catches the 444 No Response, render a very generic 404 page
  const final_interceptor = async (response: Response) =>
    response.status === NO_RESPONSE_STATUS_CODE
      ? new Response(`No resource found at ${url.pathname}\n`, {
          status: 404,
          statusText: 'Not Found',
          headers: {},
        })
      : response

  const response_interceptors: ResponseInterceptor[] = [final_interceptor]
  const context: { [key: string]: any } = {}

  let chained_request = request

  for (const responders of pipeline) {
    const response = await responders({
      request: chained_request.clone(),
      settings,
      url,
      context,
    })
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
