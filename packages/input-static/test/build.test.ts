import plugin from '../src'
import { expect } from 'chai'
import { ProtoFab } from '@fab/core'

describe('@fab/input-static', () => {
  it('should be a function', () => {
    expect(plugin.build).to.be.a('function')
  })

  it('should add files relatively to the directory', async () => {
    const proto_fab = new ProtoFab()
    await plugin.build({ dir: __dirname + '/fixtures' }, proto_fab)
    expect([...proto_fab.files.keys()]).to.have.members(['index.html'])
  })
})
