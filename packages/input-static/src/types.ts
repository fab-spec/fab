import { PluginArgs, PluginMetadata } from '@fab/core/src'

export interface InputStaticArgs extends PluginArgs {
  dir: string
}

export interface InputStaticMetadata extends PluginMetadata {}
