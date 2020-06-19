import { expect } from 'chai'
import { ProtoFab } from '@fab/core'
import { build } from '../src/build'
import { NodeCompatMetadata } from '../src/types'

describe('Build time', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })

  it('should ignore non-HTML files', async () => {
    const proto_fab = new ProtoFab<NodeCompatMetadata>()
    await build(
      {
        './needs-compiling.ts': {},
      },
      proto_fab
    )
  })
})
