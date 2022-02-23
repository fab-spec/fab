import { PluginArgs, PluginMetadata } from '@dev-spendesk/fab-core'
import webpack from 'webpack'

export interface PrecompileArgs extends PluginArgs {
  [path: string]: PluginArgs & {
    _config?: string
  }
}

export interface PrecompileMetadata extends PluginMetadata {}

export type CustomiseWebpack = (config: webpack.Configuration) => webpack.Configuration
export type CustomiseAliases = (aliases: {
  [key: string]: string
}) => { [key: string]: string }

export type PluginOverrides = {
  webpack?: CustomiseWebpack
  alias?: CustomiseAliases
}

export type ConfigOverrides = {
  customise_webpack: CustomiseWebpack
  customise_aliases: CustomiseAliases
}
