import { FABRuntime } from '@dev-spendesk/core'
import { TsExampleArgs, TsExampleMetadata } from './types'

export default function TypescriptExampleRuntime(
  { Router, Metadata }: FABRuntime<TsExampleMetadata>,
  args: TsExampleArgs
) {
  const metadata = Metadata.ts_test

  Router.onAll(async () => {
    return new Response(
      ` The time is ${metadata.what_time_is_it}!
        But we could have also gotten that from ${args.the_time_is} ooh!`,
      {
        status: 200,
      }
    )
  })
}
