import { expect } from 'chai'
import { ProtoFab } from '@fab/core'
import Builder from '../../src/actions/Builder'
import JSON5Config from '../../src/helpers/JSON5Config'

describe('Builder', () => {
  it('should find the local plugin', async () => {
    const no_runtime_config = `${__dirname}/fixtures/fab.local-plugin.json5`
    const { build_plugins, runtime_plugins } = await Builder.getPlugins(
      no_runtime_config,
      (await JSON5Config.readFrom(no_runtime_config)).data
    )
    expect(build_plugins).to.be.empty()
    expect(runtime_plugins).to.be.empty()
  })
})
