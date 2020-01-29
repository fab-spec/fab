import { PluginArgs, PluginMetadata } from '@fab/core'

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
}

export type ServerHtml = Array<Array<[string, string, number, number]>>
export type ServerHtmls = {
  [path: string]: ServerHtml
}
export interface ServeHtmlMetadata extends PluginMetadata {
  serve_html: {
    htmls: ServerHtmls
  }
}
