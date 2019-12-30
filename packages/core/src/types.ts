import { ProtoFab } from './models/ProtoFab'

export interface PluginArgs {
  [arg_name: string]: any
}

export interface BuildConfig {
  [plugin_name: string]: PluginArgs
}

export type FabSettings = {
  [var_name: string]: string
}

export interface FabConfig {
  build: BuildConfig
  runtime: string[]
  settings?: {
    [env_name: string]: FabSettings
  }
}

export interface PluginMetadata {
  [plugin_name: string]: {
    [metadata_name: string]: any
  }
}

/*
 * A FabBuildStep is an async function that takes a ProtoFab
 * and manipulates it in some way, perhaps setting metadata
 * to be used in the renderer.
 * */
export type FabBuildStep<T extends PluginArgs, U extends PluginMetadata> = (
  args: T,
  proto_fab: ProtoFab<U>
) => Promise<void>

/*
 * A FabPluginRuntime is a setup function that returns a FabRequestResponder.
 * */
export type FabPluginRuntime<T extends PluginArgs, U extends PluginMetadata> = (
  args: T,
  metadata: U
) => FabRequestResponder

/*
 * A FabRequestResponder is an async function that optionally returns
 * a Response. If this responder should not handle this request, it
 * returns undefined and the next renderer is invoked.
 * */
export type FabRequestContext = {
  request: Request
  settings: FabSettings
  url: URL
}
export type FabRequestResponder = (
  context: FabRequestContext
) => Promise<Response | undefined>

/*
 * The outermost FAB renderer has to follow the spec exactly
 * */
export type FabSpecRender = (request: Request, settings: FabSettings) => Promise<Response>

export interface FabPlugin<T extends PluginArgs, U extends PluginMetadata> {
  build: FabBuildStep<T, U>
  render: FabPluginRuntime<T, U>
}

export type FabFilesObject = { [k: string]: string }
export type FabFiles = Map<string, string>
export type FabFileMetadata = {
  [filename: string]: {
    content_type: string
    content_length: number
  }
}

export type FabMetadata = {
  file_metadata: FabFileMetadata
  plugin_metadata: PluginMetadata
}

export type ServerArgs = {
  port: string
  cert: string | undefined
  key: string | undefined
}
