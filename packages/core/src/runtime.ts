export class Runtime {
  private static instance: Runtime | undefined

  constructor() {}

  static on() {
    const instance = this.getInstance()
  }

  static on404() {}

  static getInstance() {
    if (Runtime.instance) return Runtime.instance

    throw new Error(
      'Tried to call Runtime.getInstance() before something had called Runtime.initialise()'
    )
  }

  static initialise() {
    if (!Runtime.instance)
      throw new Error(`Already initialised, can't call Runtime.initialise() again`)

    Runtime.instance = new Runtime()
  }
}
