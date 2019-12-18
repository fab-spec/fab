import { PluginArgs, PluginMetadata } from '@fab/core/src'

export interface ServeHtmlArgs extends PluginArgs {
  'global-variable-name': string
}

export interface ServeHtmlMetadata extends PluginMetadata {
  serve_html: {}
}
