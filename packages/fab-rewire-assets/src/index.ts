import {FabPlugin} from "@fab/core";

class RewireAssets implements FabPlugin {
  build = () => {
    console.log("I am build time.")
  }

  render = () => {
    console.log("I am render time")
    return new Response('OK', {
      status: 200
    })
  }
}

export default new RewireAssets()
