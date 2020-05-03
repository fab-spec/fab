import { Runtime } from '@fab/core/runtime'
import { TsExampleMetadata } from './types'

const metadata = Runtime.getMetadata<TsExampleMetadata>()

Runtime.onAll(async () => {
  return new Response(`The time is ${metadata.ts_test.what_time_is_it}!`, {
    status: 200,
  })
})
