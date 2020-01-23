import { FabBuildStep, PluginArgs } from '@fab/core/src'

export type RuntimePlugin = {
  path: string
  src: string
}
export type BuildPlugin = {
  plugin_name: string
  builder: FabBuildStep
  plugin_args: PluginArgs
}
export type Plugins = {
  build_plugins: BuildPlugin[]
  runtime_plugins: string[]
}
