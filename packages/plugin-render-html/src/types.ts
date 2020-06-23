import { PluginArgs, PluginMetadata } from '@fab/core'
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
}

export type CompiledHTMLs = {
  [path: string]: ITokens
}
export interface RenderHtmlMetadata extends PluginMetadata {
  render_html: {
    htmls: CompiledHTMLs
    resolved_fallback: string | undefined
  }
}
