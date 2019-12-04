export interface PluginArgs {
  [arg_name: string]: string
}

export interface FabConfig {
  build: {
    [plugin_name: string]: PluginArgs
  },
  settings?: {
    [env_name: string]: {
      [var_name: string]: string
    }
  }
}

export interface FabPlugin {
  build: (args: PluginArgs, proto_fab: ProtoFab) => Promise<void>
  render: () => Response
}

export type FabFiles = Map<string, string>

export class ProtoFab {
  files: FabFiles | undefined

  constructor() {
  }
}
