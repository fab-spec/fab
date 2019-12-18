import { PluginArgs, PluginMetadata } from '@fab/core/src'

export interface ServeHtmlArgs extends PluginArgs {
  'match-html'?: RegExp
  injections?: {
    env?: {
      name?: string
    }
  }
}

export type ServerHtmls = {
  [path: string]: any
}
export interface ServeHtmlMetadata extends PluginMetadata {
  serve_html: {
    htmls: ServerHtmls
  }
}
