import { PluginArgs, PluginMetadata } from '@fab/core'

export interface RewireAssetsArgs extends PluginArgs {
  'inline-threshold'?: number
  'treat-as-immutable'?: RegExp
}

export type InlineAssets = {
  [filename: string]: { contents: string; content_type: string; immutable: boolean }
}
export type RenamedAssets = {
  [filename: string]: { asset_path: string; immutable: boolean }
}

export interface RewireAssetsMetadata extends PluginMetadata<RewireAssetsArgs> {
  rewire_assets: {
    inlined_assets: InlineAssets
    renamed_assets: RenamedAssets
    args: RewireAssetsArgs
  }
}
