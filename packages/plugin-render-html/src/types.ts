import { PluginArgs, PluginMetadata } from '@dev-spendesk/fab-core'
import { ITokens } from 'micromustache'

export type EnvInjectionConfig = {
  name?: string
}

export type Injections = {
  env?: EnvInjectionConfig
  csp?: {
    name: string
  }
}

export interface RenderHtmlArgs extends PluginArgs {
  'match-html'?: RegExp
  injections?: Injections
  fallback?: string | boolean
  inline?: 'fallback-only' | boolean
}

export type CompiledHTMLs = {
  [path: string]: ITokens
}

export type AssetHTMLs = {
  [path: string]: string
}

export interface RenderHtmlMetadata extends PluginMetadata {
  render_html: {
    inlined_htmls: CompiledHTMLs
    resolved_fallback: string | undefined
    asset_html_paths: AssetHTMLs
  }
}
