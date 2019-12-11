import { PluginArgs, PluginMetadata } from '@fab/core/src'

export interface RewireAssetsArgs extends PluginArgs {
  'inline-threshold'?: number
  'treat-as-immutable'?: RegExp
}

export type InlineAssets = Map<string, { contents: string; content_type: string }>
export type RenamedAssets = Map<string, { asset_path: string; immutable: boolean }>

export interface RewireAssetsMetadata extends PluginMetadata {
  rewire_assets: {
    inlined_assets: InlineAssets
    renamed_assets: RenamedAssets
  }
}
