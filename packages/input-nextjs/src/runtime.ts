import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { FabPluginRuntime } from '@fab/core'

export const runtime: FabPluginRuntime<InputNextJSArgs, InputNextJSMetadata> = (
  args: InputNextJSArgs,
  metadata: InputNextJSMetadata
) => {
  console.log('I am input-nextjs render time!')

  return async function render({ url }) {
    return undefined
  }
}
