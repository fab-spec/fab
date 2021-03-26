// @ts-ignore
import FLAREACT_RENDERER from 'FLAREACT_RENDERER.js'
import { FABRuntime, Priority } from '@fab/core'

export default function InpuFlareactRuntime({ Router }: FABRuntime) {
  Router.onAll(async function responder({ request, url }) {
    /* WHATEVER YOU NEED TO DO, DO IT HERE.  */
    const response = await FLAREACT_RENDERER.handle(request)

    /* NEED TO RETURN UNDEFINED IF YOU WANT @fab/plugin-rewire-assets to work */
    /* WE ALSO MIGHT NEED TO CHANGE THIS LOGIC IF THIS DOESN'T WORK */
    if (response.status === 404) return undefined

    return response
  })
}
