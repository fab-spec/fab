import { ProtoFab } from './models/ProtoFab'

export interface PluginArgs {
  [arg_name: string]: any
}

export interface PluginConfig {
  [plugin_name: string]: PluginArgs
}

export type FabSettings = {
  [var_name: string]: string
}

export type DeployConfig = {
  cf_workers_name?: string
  s3_asset_bucket?: string
}

export interface FabConfig {
  plugins: PluginConfig
  settings?: {
    [env_name: string]: FabSettings
  }
  deploy?: DeployConfig
  rollup_plugins?: PluginConfig
}

export interface PluginMetadataContent {
  [metadata_name: string]: any
}

export interface PluginMetadata {
  [plugin_name: string]: PluginMetadataContent
}

/*
 * A FabBuildStep is an async function that takes a ProtoFab
 * and manipulates it in some way, perhaps setting metadata
 * to be used in the renderer.
 * */
export type FabBuildStep<
  T extends PluginArgs = PluginArgs,
  U extends PluginMetadata = PluginMetadata
> = (args: T, proto_fab: ProtoFab<U>) => Promise<void>

/*
 * A FabPluginRuntime is a setup function that returns a FabRequestResponder.
 * */
export type FabPluginRuntime<
  T extends PluginArgs = PluginArgs,
  U extends PluginMetadata = PluginMetadata
> = (args: T, metadata: U) => FabRequestResponder

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

export enum SandboxType {
  v8isolate,
  nodeVm,
}

/*
 * The outermost FAB exported functions, that cross the boundary
 * between the platform-specific runtimes (@fab/server,
 * @fab/cf-workers-wrapper, Linc.sh etc) and the FAB itself.
 * */
export type FabSpecRender = (request: Request, settings: FabSettings) => Promise<Response>
export type FabSpecMetadata = {
  production_settings: FabSettings
}

export type FabSpecExports = {
  render: FabSpecRender
  metadata: FabSpecMetadata
}
