/* Outermost FAB server, imports the plugin chain and responds to requests */

import { FabSettings, FabSpecRender } from '@fab/core'

export const render: FabSpecRender = (request: Request, settings: FabSettings) => {
  console.log(request.url)
  console.log("It's definitely being called, Glen.")

  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
    headers: {},
  })
}
