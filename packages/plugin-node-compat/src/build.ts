import { ProtoFab } from '@fab/core'
import { NodeCompatArgs, NodeCompatMetadata } from './types'
import { _log } from '@fab/cli'

const log = _log('@fab/plugin-node-compat')

export async function build(
  args: NodeCompatArgs,
  proto_fab: ProtoFab<NodeCompatMetadata>
) {
  /*
   * TODO
   *
   * Port the @fab/input-nextjs stuff across, shimming out pieces as needed.
   * Make each file a new "runtime", that's compiled using webpack, with a bunch
   * of good defaults but the args for each section are all the overrides.
   *
   * */
  return Object.keys(args)
}
