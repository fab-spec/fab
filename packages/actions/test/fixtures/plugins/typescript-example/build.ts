import { FabBuildStep } from '@dev-spendesk/core'
import { TsExampleMetadata, TsExampleArgs } from './types'

export const build: FabBuildStep<TsExampleArgs, TsExampleMetadata> = async (
  args,
  proto_fab
) => {
  /* This line is fully typesafe! */
  proto_fab.metadata.ts_test.what_time_is_it = args.the_time_is
}
