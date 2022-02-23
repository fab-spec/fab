import { PluginArgs, PluginMetadata } from '@dev-spendesk/core'

export interface RewireAssetsArgs extends PluginArgs {
  'inline-threshold'?: number
  'treat-as-immutable'?: RegExp
  'chunk-threshold'?: number
}

export type InlineAssets = {
  [filename: string]: { contents: string; content_type: string; immutable: boolean }
}
export type RenamedAssets = {
  [filename: string]: { chunks_paths: string[]; immutable: boolean }
}

export interface RewireAssetsMetadata extends PluginMetadata {
  rewire_assets: {
    inlined_assets: InlineAssets
    renamed_assets: RenamedAssets
  }
}
