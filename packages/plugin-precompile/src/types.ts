import { PluginArgs, PluginMetadata } from '@fab/core'

export interface PrecompileArgs extends PluginArgs {
  [path: string]: PluginArgs & {
    _config?: string
  }
}

export interface PrecompileMetadata extends PluginMetadata {}
