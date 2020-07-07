import { ProtoFab } from './models/ProtoFab'
import { ConfigTypes } from './constants'

export interface PluginArgs {
  [arg_name: string]: any
}

export interface BuildConfig {
  [plugin_name: string]: PluginArgs
}

export type FabSettings = {
  [var_name: string]: string | boolean
}

export type DeployConfig = {
  'cf-workers'?: ConfigTypes.CFWorkers
  'aws-lambda-edge'?: ConfigTypes.AwsLambda
  'aws-s3'?: ConfigTypes.AwsS3
}
export type DeployProviders = keyof DeployConfig

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

export type LoadedPlugin = {
  plugin_name: string
  plugin_args: PluginArgs
  builder: FabBuildStep | undefined
  runtimes: string[]
}

/*
 * A FabBuildStep is an async function that takes a ProtoFab
 * and manipulates it in some way, perhaps setting metadata
 * to be used in the renderer.
 * */
export type FabBuildStep<
  T extends PluginArgs = PluginArgs,
  U extends PluginMetadata = PluginMetadata
> = (
  args: T,
  proto_fab: ProtoFab<U>,
  config_path: string,
  skip_cache?: boolean
) => Promise<void | string[]>

export type FabResponderMutableContext = {
  [key: string]: any
}
export type Cookies = {
  [key: string]: string
}
export type FabResponderArgs = {
  request: Request
  settings: FabSettings
  url: URL
  context: FabResponderMutableContext
  cookies: Cookies
}
/*
 * A FabRequestResponder is an async function that optionally returns
 * a Response. If this responder should not handle this request, it
 * returns undefined and the next renderer is invoked.
 * */
export type FabRequestResponder = (
  context: FabResponderArgs
) => Promise<undefined | Request | Response | Directive>

export type MatchParams = { [match_name: string]: string }

export type FabRequestResponderWithParams = (
  contextWithParams: FabResponderArgs & { params: MatchParams }
) => ReturnType<FabRequestResponder>

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

export type FabCacheValue = string | number | ArrayBuffer | ReadableStream
export type FabCache = {
  set: (key: string, value: FabCacheValue, ttl_seconds?: number) => Promise<void>
  setJSON: (key: string, value: any, ttl_seconds?: number) => Promise<void>
  get: (key: string) => Promise<string | undefined>
  getJSON: (key: string) => Promise<any | undefined>
  getNumber: (key: string) => Promise<number | undefined>
  getArrayBuffer: (key: string) => Promise<ArrayBuffer | undefined>
  getStream: (key: string) => Promise<ReadableStream | undefined>
}

// To be extended with host-specific capabilities
export type FABServerContext = {
  bundle_id: string
  cache?: FabCache
}

export type ServerConstructor = (filename: string, args: ServerArgs) => ServerType
export interface ServerType {
  serve(
    runtimeType: SandboxType,
    watch: boolean,
    proxyWs: string | undefined
  ): Promise<void>
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
  fab_version: string
}

export type FabSpecExports = {
  render: FabSpecRender
  metadata: FabSpecMetadata
  initialize: (server_context: FABServerContext) => void
}

export type FetchApi = (url: string | Request, init?: RequestInit) => Promise<Response>

export type FabServerDeployer<T extends ConfigTypes.Union> = (
  fab_path: string,
  working_dir: string,
  config: T,
  env_overrides: FabSettings,
  assets_url: string
) => Promise<string>

export type FabAssetsDeployer<T extends ConfigTypes.Union> = (
  fab_path: string,
  working_dir: string,
  config: T
) => Promise<string>

export type FabDeployer<T extends ConfigTypes.Union> = (
  fab_path: string,
  working_dir: string,
  config: T,
  env_overrides: FabSettings
) => Promise<string>

export type FabDeployerExports<T extends ConfigTypes.Union> = {
  deployServer?: FabServerDeployer<T>
  deployAssets?: FabAssetsDeployer<T>
  deployBoth?: FabDeployer<T>
}

export type FabPackager<T extends ConfigTypes.Union> = (
  fab_path: string,
  package_path: string,
  config: T,
  env_overrides: FabSettings,
  assets_url: string
) => Promise<void>

export type FabPackagerExports<T extends ConfigTypes.Union> = {
  createPackage: FabPackager<T>
}

export interface JSON5ConfigI {
  data: FabConfig
  str_contents: string
  write(file_path: string): Promise<void>
}

export type PackageFn = (
  file_path: string,
  config: FabConfig,
  target: DeployProviders,
  output_path: string | undefined,
  assets_url: string,
  env: string | undefined
) => Promise<void>

export type DeployFn = (
  config: JSON5ConfigI,
  file_path: string,
  package_dir: string,
  server_host: DeployProviders | undefined,
  assets_host: DeployProviders | undefined,
  env: string | undefined,
  assets_only: boolean,
  assets_already_deployed_at: string | undefined,
  auto_install: boolean
) => Promise<string>

export type BuildFn = (
  config_path: string,
  config: FabConfig,
  skip_cache: boolean,
  skip_typecheck: boolean
) => Promise<void>

export type FabActionsExports = {
  Packager: {
    package: PackageFn
  }
  Deployer: {
    deploy: DeployFn
  }
  Builder: {
    build: BuildFn
  }
}

export type FabServerExports = {
  createServer: ServerConstructor
}
