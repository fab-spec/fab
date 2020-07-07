import {
  FabRequestResponder,
  PluginMetadata,
  FabResponderArgs,
  FabFileMetadata,
  FabMetadata,
  FabRequestResponderWithParams,
  MatchParams,
  FabCache,
  FABServerContext,
  PluginArgs,
  ResponseInterceptor,
} from '@fab/core'
import { Key, pathToRegexp } from 'path-to-regexp'

export enum Priority {
  LAST,
  LATER,
  MIDDLE,
  EARLY,
  FIRST,
}

export type FabPluginRuntime = (Runtime: FABRuntime, args: PluginArgs) => void

/* This is the type of the 'fab-runtime-imports' alias in the build */
export type RuntimeImports = Array<{
  plugin: FabPluginRuntime
  args: PluginArgs
}>

export class FABRouter {
  private pipeline: { [order in Priority]: FabRequestResponder[] }

  constructor() {
    this.pipeline = {
      [Priority.LAST]: [],
      [Priority.LATER]: [],
      [Priority.MIDDLE]: [],
      [Priority.EARLY]: [],
      [Priority.FIRST]: [],
    }
  }

  getPipeline() {
    return [
      ...this.pipeline[Priority.FIRST],
      ...this.pipeline[Priority.EARLY],
      ...this.pipeline[Priority.MIDDLE],
      ...this.pipeline[Priority.LATER],
      ...this.pipeline[Priority.LAST],
    ]
  }

  addToPipeline(responder: FabRequestResponder, priority: Priority = Priority.MIDDLE) {
    this.pipeline[priority].push(responder)
  }

  on(route: string, responder: FabRequestResponderWithParams, priority?: Priority) {
    if (route === '*') {
      // Make this an alias for .onAll, with an empty params object
      this.onAll((context) => responder({ ...context, params: {} }), priority)
    } else {
      // Otherwise compile the route and generate a responder
      const groups: Key[] = []
      const regexp = pathToRegexp(route, groups)
      this.addToPipeline(async (context: FabResponderArgs) => {
        const { pathname } = context.url
        // Only execute if this request matches our route
        const match = regexp.exec(pathname)
        if (match) {
          const params: MatchParams = {}
          groups.forEach((group, i) => {
            params[group.name] = match[i + 1]
          })
          return await responder({ ...context, params })
        }
        return undefined
      }, priority)
    }
  }

  onAll(responder: FabRequestResponder, priority?: Priority) {
    this.addToPipeline(responder, priority)
  }

  interceptResponse(
    interceptor: ResponseInterceptor,
    priority: Priority = Priority.EARLY
  ) {
    this.addToPipeline(async (context) => {
      return {
        interceptResponse: interceptor,
      }
    }, priority)
  }
}

class NoopCache implements FabCache {
  set = async () => {}
  setJSON = async () => {}
  get = async () => undefined
  getJSON = async () => undefined
  getArrayBuffer = async () => undefined
  getNumber = async () => undefined
  getStream = async () => undefined
}

export class FABRuntime<T extends PluginMetadata = PluginMetadata> {
  Metadata: T
  FileMetadata: FabFileMetadata
  Router: FABRouter
  Cache: FabCache
  ServerContext: FABServerContext

  constructor(metadata: T, file_metadata: FabFileMetadata, context: FABServerContext) {
    this.Metadata = metadata
    this.FileMetadata = file_metadata
    this.Router = new FABRouter()
    this.Cache = context.cache || new NoopCache()
    this.ServerContext = context
  }

  static initialize(
    metadata: FabMetadata,
    plugins: RuntimeImports,
    context: FABServerContext
  ) {
    const instance = new FABRuntime(
      metadata.plugin_metadata,
      metadata.file_metadata,
      context
    )
    plugins.forEach(({ plugin, args }) => plugin(instance, args))
    return instance
  }

  getPipeline() {
    return this.Router.getPipeline()
  }
}
