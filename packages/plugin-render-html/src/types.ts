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

export interface ServeHtmlArgs extends PluginArgs {
  'match-html'?: RegExp
  injections?: Injections
  fallback?: string | boolean
}

export type ServerHtmls = {
  [path: string]: ITokens
}
export interface ServeHtmlMetadata extends PluginMetadata {
  serve_html: {
    htmls: ServerHtmls
    resolved_fallback: string | undefined
  }
}
