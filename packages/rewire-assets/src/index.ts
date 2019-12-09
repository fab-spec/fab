import { FabPlugin, PluginArgs, ProtoFab } from '@fab/core'

class RewireAssets implements FabPlugin {
  async build(args: PluginArgs, proto_fab: ProtoFab) {}

  render() {
    console.log('I am render time')
    return new Response('OK', {
      status: 200,
    })
  }
}

export default new RewireAssets()
