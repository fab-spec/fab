/* Outermost FAB server, imports the plugin chain and responds to requests */

import {
  Directive,
  Cookies,
  FabResponderMutableContext,
  FABRuntime,
  FABServerContext,
  FabSettings,
  FabSpecMetadata,
  FabSpecRender,
  NO_RESPONSE_STATUS_CODE,
  ResponseInterceptor,
} from '@fab/core'

import final_responder from './final_responder'
// @ts-ignore
import { runtimes } from 'user-defined-pipeline'
// @ts-ignore
import { fab_metadata } from 'fab-metadata'
// @ts-ignore
import { production_settings } from 'production-settings'

function parseCookies(request: Request) {
  const cookies: Cookies = {}

  const cookies_header = request.headers.get('Cookie')
  if (cookies_header) {
    cookies_header.split(';').forEach((cookie) => {
      const [key, value] = cookie.split('=').map((s) => s.trim())
      cookies[key] = value
    })
  }

  return cookies
}

let Runtime: FABRuntime | undefined = undefined
export const initialize = (server_context: FABServerContext) => {
  Runtime = FABRuntime.initialize(
    fab_metadata,
    [...runtimes, final_responder],
    server_context
  )
}

export const render: FabSpecRender = async (request: Request, settings: FabSettings) => {
  // Support pre-v0.2 hosts
  if (!Runtime) {
    console.log(`render() called without initialize()`)
    console.log(`Injecting a dummy ServerContext`)
    initialize({ bundle_id: '' })
    // If we still don't have Runtime, we have to bail here.
    if (!Runtime) throw new Error('Initialise called but no Runtime created!')
  }
  // If no middleware catches the 444 No Response, render a very generic 404 page
  const final_interceptor = async (response: Response) =>
    response.status === NO_RESPONSE_STATUS_CODE
      ? new Response(`No resource found at ${request.url}\n`, {
          status: 404,
          statusText: 'Not Found',
          headers: {},
        })
      : response

  const response_interceptors: ResponseInterceptor[] = [final_interceptor]
  const context: FabResponderMutableContext = {}

  let chained_request = request
  let cookies = parseCookies(request)

  for (const responder of Runtime.getPipeline()) {
    // Always take a copy of request & url so a middleware doesn't accidentally modify it.
    // Passing data between middlewares is what 'context' is for.
    // Modifying requests is what 'replaceRequest' is for.
    const request_context = {
      request: chained_request.clone(),
      url: new URL(chained_request.url),
      settings,
      context: context,
      cookies,
    }

    const response = await responder(request_context)
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
      // Reevaluate the dependant values of the request
      chained_request = directive.replaceRequest
      cookies = parseCookies(chained_request)
    }
  }

  return new Response(`Error! Expected a plugin to respond!`, {
    status: 500,
    headers: {},
  })
}

export const metadata: FabSpecMetadata = {
  production_settings,
  fab_version: '0.2',
}

/* Legacy support for env settings */
export const getProdSettings = () => {
  return metadata.production_settings
}
