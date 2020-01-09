import { PluginMetadata, ProtoFab } from '@fab/core'
import { build } from '../src/build'
import { shouldThrow } from '@fab/core/test/helpers'

describe('@fab/input-nextjs', () => {
  it('should require a dir argument', async () => {
    await shouldThrow(
      // @ts-ignore
      () => build({}, new ProtoFab()),
      `@fab/input-nextjs requires an argument of 'dir'.`
    )
  })
})
