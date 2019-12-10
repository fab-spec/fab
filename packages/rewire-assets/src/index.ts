import { FabPlugin, PluginArgs, ProtoFab } from '@fab/core'

interface RewireAssetsArgs extends PluginArgs {
  'inline-threshold': number
  'treat-as-immutable': RegExp
}

class RewireAssets implements FabPlugin<PluginArgs> {
  async build(args: PluginArgs, proto_fab: ProtoFab) {}

  render() {
    console.log('I am render time')
    return new Response('OK', {
      status: 200,
    })
  }
}

export default new RewireAssets()
