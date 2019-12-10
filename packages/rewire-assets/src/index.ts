import { FabPlugin, InvalidConfigError, PluginArgs, ProtoFab } from '@fab/core'

interface RewireAssetsArgs extends PluginArgs {
  'inline-threshold'?: number
  'treat-as-immutable'?: RegExp
}

class RewireAssets implements FabPlugin<RewireAssetsArgs> {
  async build(args: RewireAssetsArgs, proto_fab: ProtoFab) {
    const {
      'inline-threshold': inline_threshold = 8192,
      'treat-as-immutable': immutable_regexp = /\.[0-9A-F]{8,}\./i,
    } = args

    if (Number.isNaN(inline_threshold)) {
      throw new InvalidConfigError(`'inline-threshold' value must be a number!`)
    }
    if (!(immutable_regexp instanceof RegExp)) {
      throw new InvalidConfigError(
        `'treat-as-immutable' value must be a regex-parser compatible RegExp string!`
      )
    }
  }

  render() {
    console.log('I am render time')
    return new Response('OK', {
      status: 200,
    })
  }
}

export default new RewireAssets()
