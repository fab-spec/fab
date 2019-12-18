import { expect } from 'chai'
import { ProtoFab } from '@fab/core'
import { build } from '../src/build'
import { ServeHtmlMetadata } from '../src/types'

describe('Build time', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })

  it('should ignore non-HTML files', async () => {
    const files = {
      '/main.css': 'some { css: here; }',
    }
    const proto_fab = new ProtoFab<ServeHtmlMetadata>(files)
    await build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([...Object.entries(files)])
  })

  it('should remove HTML files from the list', async () => {
    const files = {
      '/index.html': '<html>here</html>',
    }
    const proto_fab = new ProtoFab<ServeHtmlMetadata>(files)
    await build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([])
  })
})
