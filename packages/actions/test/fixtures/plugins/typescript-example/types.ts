import { PluginArgs, PluginMetadata } from '@dev-spendesk/fab-core'

export interface TsExampleArgs extends PluginArgs {
  the_time_is: string
}

export interface TsExampleMetadata extends PluginMetadata {
  ts_test: {
    what_time_is_it: string
  }
}
