import { FabMetadata, FabRequestResponder, PluginMetadata } from '@fab/core'

export enum Priority {
  LAST,
  LATER,
  MIDDLE,
  EARLY,
  FIRST,
}

export class Runtime {
  private static instance: Runtime | undefined
  private metadata: PluginMetadata
  private pipeline: {
    [order in Priority]: FabRequestResponder[]
  }

  constructor(metadata: PluginMetadata) {
    this.metadata = metadata
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

  static on(route: string, callback: () => {}, priority: string) {
    const instance = this.getInstance()
  }

  static onAll(responder: FabRequestResponder, priority?: Priority) {
    const instance = this.getInstance()
  }

  static on404() {}

  static getMetadata<T extends PluginMetadata = PluginMetadata>() {
    return this.getInstance().metadata as T
  }

  static getInstance(): Runtime {
    if (Runtime.instance) return Runtime.instance

    throw new Error(
      'Tried to call Runtime.getInstance() before something had called Runtime.initialise()'
    )
  }

  static initialise(metadata: FabMetadata) {
    if (!Runtime.instance)
      throw new Error(`Already initialised, can't call Runtime.initialise() again`)

    return (Runtime.instance = new Runtime(metadata))
  }
}
