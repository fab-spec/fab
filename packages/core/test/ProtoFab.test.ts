import { expect } from 'chai'
import { ProtoFab } from '@fab/core'

describe('ProtoFab', () => {
  it('should be able to be created with no args', () => {
    expect(new ProtoFab()).to.be.instanceOf(ProtoFab)
  })
  it('should be take a list of files', () => {
    expect(
      new ProtoFab({
        'index.html': 'Some content',
      })
    ).to.be.instanceOf(ProtoFab)
  })

  it('should be serialisable', () => {
    const protoFab = new ProtoFab({
      'index.html': 'Some content',
    })
    const expected = {
      file_metadata: {
        'index.html': {
          content_type: 'text/html; charset=utf-8',
          content_length: 12,
        },
      },
      plugin_metadata: {},
    }
    expect(protoFab.serialisable()).to.deep.equal(expected)
    expect(protoFab.toJSON()).to.equal(JSON.stringify(expected))
  })
})
