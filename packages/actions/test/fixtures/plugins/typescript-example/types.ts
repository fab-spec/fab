import { PluginArgs, PluginMetadata } from '@fab/core'

export interface TsExampleArgs extends PluginArgs {
  the_time_is: string
}

export interface TsExampleMetadata extends PluginMetadata<TsExampleArgs> {
  ts_test: {
    what_time_is_it: string
    args: TsExampleArgs
  }
}
