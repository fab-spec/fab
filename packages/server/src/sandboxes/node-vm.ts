import vm from 'vm'
import * as fetch from 'node-fetch'
import { FabSpecExports } from '@fab/core'

export default async (src: string): Promise<FabSpecExports> => {
  const { Request } = fetch

  const sandbox = {
    fetch: fetch,
    Request: fetch.Request,
    Response: fetch.Response,
    Headers: fetch.Headers,
    URL: URL,
    console: {
      log: console.log,
      error: console.error,
    },
    NODE_ENV: 'server',
    process: {
      env: {
        NODE_ENV: 'server',
      },
    },
    setTimeout,
    setImmediate,
    clearTimeout,
  }

  const script = new vm.Script(src)
  const exp = {}
  const ctx = Object.assign({}, sandbox, { module: { exports: exp } })
  const renderer = script.runInNewContext(ctx)
  return renderer
}
