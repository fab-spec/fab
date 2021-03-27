// @ts-ignore
import { handleEvent } from 'flareact'
import { FABRuntime, Priority } from '@fab/core'

export default function FlareactRuntime({ Router }: FABRuntime) {
  Router.onAll(async function responder({ request, url }) {
    /* WHATEVER YOU NEED TO DO, DO IT HERE.  */
    const response = await handleEvent.handle(request)

    /* NEED TO RETURN UNDEFINED IF YOU WANT @fab/plugin-rewire-assets to work */
    /* WE ALSO MIGHT NEED TO CHANGE THIS LOGIC IF THIS DOESN'T WORK */
    if (response.status === 404) return undefined

    return response
  })
}
