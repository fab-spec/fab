import {
  FabRequestResponder,
  PluginMetadata,
  FabRequestResponderWithMatches,
  FabResponderArgs,
  FabFileMetadata,
  FabMetadata,
} from '@fab/core'
import { Key, pathToRegexp } from 'path-to-regexp'

export enum Priority {
  LAST,
  LATER,
  MIDDLE,
  EARLY,
  FIRST,
}

export type FabPluginRuntime = (Runtime: FABRuntime) => void

export class FABRuntime<T extends PluginMetadata = PluginMetadata> {
  metadata: T
  file_metadata: FabFileMetadata
  private pipeline: {
    [order in Priority]: FabRequestResponder[]
  }

  constructor(metadata: T, file_metadata: FabFileMetadata) {
    this.metadata = metadata
    this.file_metadata = file_metadata
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

  onCondition(
    test_fn: (context: FabResponderArgs) => boolean,
    responder: FabRequestResponder,
    priority?: Priority
  ) {
    this.addToPipeline(async (context: FabResponderArgs) => {
      if (test_fn(context)) {
        return await responder(context)
      }
      return undefined
    }, priority)
  }

  startsWith(prefix: string, responder: FabRequestResponder, priority?: Priority) {
    this.onCondition(({ url }) => url.pathname.startsWith(prefix), responder, priority)
  }

  exact(match: string, responder: FabRequestResponder, priority?: Priority) {
    this.onCondition(({ url }) => url.pathname === match, responder, priority)
  }

  matches(route: string, responder: FabRequestResponderWithMatches, priority?: Priority) {
    const groups: Key[] = []
    const regexp = pathToRegexp(route, groups)
    console.log(regexp)
    console.log({ groups })
    this.addToPipeline(async (context: FabResponderArgs) => {
      const { pathname } = context.url
      const match = regexp.exec(pathname)
      if (match) {
        const named_matches: { [key: string]: string } = {}
        groups.forEach((group, i) => {
          named_matches[group.name] = match[i + 1]
        })
        return await responder(named_matches, context)
      }
      return undefined
    }, priority)
  }

  onAll(responder: FabRequestResponder, priority?: Priority) {
    this.addToPipeline(responder, priority)
  }

  on404() {}

  static initialize(metadata: FabMetadata, plugins: FabPluginRuntime[]) {
    const instance = new FABRuntime(metadata.plugin_metadata, metadata.file_metadata)
    plugins.forEach((plugin) => plugin(instance))
    return instance
  }
}
