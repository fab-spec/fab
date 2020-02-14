import { expect } from 'chai'
import { ProtoFab } from '@fab/core'

describe('ProtoFab', () => {
  it('should be able to be created with no args', () => {
    expect(new ProtoFab()).to.be.instanceOf(ProtoFab)
  })

  it('should be take a list of files', () => {
    expect(
      new ProtoFab({
        '/index.html': 'Some content',
      })
    ).to.be.instanceOf(ProtoFab)
  })

  it('should be serialisable', () => {
    const protoFab = new ProtoFab({
      '/index.html': 'Some content',
    })
    const expected = {
      file_metadata: {
        '/index.html': {
          content_length: 12,
          content_type: 'text/html; charset=utf-8',
        },
      },
      plugin_metadata: {},
    }
    expect(protoFab.serialisable()).to.deep.equal(expected)
    expect(protoFab.toJSON()).to.equal(JSON.stringify(expected))
  })

  describe('errorsPreventingCompilation', () => {
    it('should be ok with a server file', () => {
      expect(
        new ProtoFab({
          '/server.js': 'Some content',
        }).errorsPreventingCompilation()
      ).to.be.undefined
    })

    it('should be ok with assets', () => {
      expect(
        new ProtoFab({
          '/_assets/index.html': 'Some content',
          '/_assets/main.css': 'Something else',
        }).errorsPreventingCompilation()
      ).to.be.undefined
    })

    it('should complain about anything else', () => {
      expect(
        new ProtoFab({
          '/index.html': 'Some content',
          '/main.css': 'Something else',
        }).errorsPreventingCompilation()
      ).to.equal(
        `Build config leaves files outside of _assets dir: /index.html, /main.css`
      )
    })
  })
})
