import { PluginArgs, PluginMetadata } from '@fab/core/src'

export interface ServeHtmlArgs extends PluginArgs {
  'match-html'?: RegExp
  injections?: {
    env?: {
      name?: string
    }
  }
}

export interface ServeHtmlMetadata extends PluginMetadata {
  serve_html: {}
}
