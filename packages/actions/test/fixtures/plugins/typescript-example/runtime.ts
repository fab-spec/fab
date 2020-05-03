import { Runtime } from '@fab/core/runtime'
import { TsExampleMetadata } from './types'

const metadata = Runtime.getMetadata<TsExampleMetadata>().ts_test

Runtime.onAll(async () => {
  return new Response(
    `
    The time is ${metadata.what_time_is_it}!
    But we could have also gotten that from ${metadata.args.the_time_is} ooh!
  `,
    {
      status: 200,
    }
  )
})
