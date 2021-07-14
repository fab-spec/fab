import { PluginArgs, PluginMetadata } from '@fab/core'

export interface InputFlareactArgs extends PluginArgs {
  static_dir: string
  worker_path: string
}

export interface InputFlareactMetadata extends PluginMetadata {}
