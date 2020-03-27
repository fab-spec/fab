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

export type DeployConfig = {
  [provider: string]: any
}

export interface FabConfig {
  plugins: BuildConfig
  settings?: {
    [env_name: string]: FabSettings
  }
  deploy?: DeployConfig
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
> = (args: T, proto_fab: ProtoFab<U>, config_path: string) => Promise<void>

/*
 * A FabPluginRuntime is a setup function that returns a FabRequestResponder.
 * */
export type FabPluginRuntime<
  T extends PluginArgs = PluginArgs,
  U extends PluginMetadata = PluginMetadata
> = (args: T, metadata: U) => FabRequestResponder

export type FabResponderMutableContext = {
  [key: string]: any
}
export type FabResponderArgs = {
  request: Request
  settings: FabSettings
  url: URL
  context: FabResponderMutableContext
}
/*
 * A FabRequestResponder is an async function that optionally returns
 * a Response. If this responder should not handle this request, it
 * returns undefined and the next renderer is invoked.
 * */
export type FabRequestResponder = (
  context: FabResponderArgs
) => Promise<undefined | Request | Response | Directive>

export type ResponseInterceptor = (response: Response) => Promise<Response>

export type Directive = {
  interceptResponse?: ResponseInterceptor
  replaceRequest?: Request
}

export type FabFilesObject = { [k: string]: string }
export type FabFiles = Map<string, Buffer>
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
  env: string | undefined
  config: string
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
export type FabSpecRender = (
  request: Request,
  settings: FabSettings
) => Promise<Request | Response>
export type FabSpecMetadata = {
  production_settings: FabSettings
}

export type FabSpecExports = {
  render: FabSpecRender
  metadata: FabSpecMetadata
}

export type FetchApi = (url: string | Request, init?: RequestInit) => Promise<Response>

export type FabDeployer<T> = (
  fab_path: string,
  working_dir: string,
  config: T
) => Promise<string>

export type FabServerDeployer<T> = (
  fab_path: string,
  working_dir: string,
  asset_url: string,
  config: T
) => Promise<string>

export type FabDeployerExports<T> = {
  deployServer?: FabServerDeployer<T>
  deployAssets?: FabDeployer<T>
  deployBoth?: FabDeployer<T>
}

export type FabPackagerConfig = {
  asset_url: string | undefined
}

export type FabPackager<T extends FabPackagerConfig> = (
  fab_path: string,
  package_path: string,
  config: T
) => Promise<void>

export type FabPackagerExports<T extends FabPackagerConfig> = {
  createPackage: FabPackager<T>
}

export type AwsLambdaEdgeDeployConfig = {
  access_key_id: string
  secret_access_key: string
  region: string
  cf_distribution_id: string
  lambda_arn: string
}

export type AwsS3DeployConfig = {
  access_key_id: string
  secret_access_key: string
}
