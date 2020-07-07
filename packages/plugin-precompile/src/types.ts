import { PluginArgs, PluginMetadata } from '@fab/core'

export type WebpackArgs = {}

export interface NodeCompatArgs extends PluginArgs {
  [path: string]: WebpackArgs
}

export interface NodeCompatMetadata extends PluginMetadata {}
