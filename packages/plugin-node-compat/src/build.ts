import { ProtoFab } from '@fab/core'
import { NodeCompatArgs, NodeCompatMetadata } from './types'
import { _log } from '@fab/cli'

const log = _log('@fab/plugin-node-compat')

export async function build(
  args: NodeCompatArgs,
  proto_fab: ProtoFab<NodeCompatMetadata>
) {}
