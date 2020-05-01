import {
  ProtoFab,
  PluginArgs,
  FabBuildStep,
  FabPluginRuntime,
  PluginMetadata,
} from '@fab/core'

export const build: FabBuildStep = async (args: PluginArgs, proto_fab: ProtoFab) => {
  proto_fab.metadata.ts_test = args.now
}

export const runtime: FabPluginRuntime = (args: PluginArgs, metadata: PluginMetadata) => {
  return async ({}) => {
    return new Response(`${metadata.ts_test}`, {
      status: 200,
    })
  }
}
