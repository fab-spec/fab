import { PluginArgs, PluginMetadata, BuildShims } from '@fab/core'

export interface InputNextJSArgs extends PluginArgs {
  shims?: BuildShims
}

export interface InputNextJSMetadata extends PluginMetadata {}
