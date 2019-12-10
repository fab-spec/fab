import plugin, { RewireAssetsMetadata } from '../src'
import { expect } from 'chai'
import { PluginMetadata, ProtoFab } from '@fab/core'

describe('Build time', () => {
  it('should be a function', () => {
    expect(plugin.build).to.be.a('function')
  })

  it('should ignore files in _assets already', async () => {
    const files = {
      '_assets/some.file': '< some contents >',
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await plugin.build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([...Object.entries(files)])
  })

  it('should ignore server file', async () => {
    const files = {
      'server.js': '< some contents >',
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await plugin.build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([...Object.entries(files)])
  })

  it('should inline small files by default', async () => {
    const files = {
      'index.html': '< some contents >',
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await plugin.build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([])
    expect([...proto_fab.metadata.rewire_assets.inlined_assets.entries()]).to.deep.equal([
      [
        'index.html',
        {
          contents: '< some contents >',
          content_type: 'text/html',
        },
      ],
    ])
  })
})
