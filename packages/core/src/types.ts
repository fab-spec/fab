import { ProtoFab } from './models/ProtoFab'

export interface PluginArgs {
  [arg_name: string]: string | number | RegExp | undefined
}

export interface BuildConfig {
  [plugin_name: string]: PluginArgs
}

export interface FabConfig {
  build: BuildConfig
  settings?: {
    [env_name: string]: {
      [var_name: string]: string
    }
  }
}

export interface PluginMetadata {
  [plugin_name: string]: {
    [metadata_name: string]: any
  }
}

export interface FabPlugin<T extends PluginArgs, U extends PluginMetadata> {
  build: (args: T, proto_fab: ProtoFab<U>) => Promise<void>
  render: () => Response
}

export type FabFiles = Map<string, string>
