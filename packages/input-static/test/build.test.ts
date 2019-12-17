import { expect } from 'chai'
import { PluginMetadata, ProtoFab } from '@fab/core'
import { build } from '../src/build'

describe('@fab/input-static', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })

  it('should add files relatively to the directory', async () => {
    const proto_fab = new ProtoFab<PluginMetadata>()
    await build({ dir: __dirname + '/fixtures' }, proto_fab)
    expect([...proto_fab.files.keys()]).to.have.members(['/index.html'])
  })
})
