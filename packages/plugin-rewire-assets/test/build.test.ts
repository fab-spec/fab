import { expect } from 'chai'
import { PluginMetadata, ProtoFab } from '@fab/core'
import hasha from 'hasha'
import { RewireAssetsMetadata } from '../src/types'
import { build } from '../src/build'

const EXAMPLES = {
  HTML: '< some contents >',
  CSS: 'body { font-family: Comic Sans MS; font-size: 48px; }',
}
const css_hash = hasha(EXAMPLES.CSS, { algorithm: 'md5' }).slice(0, 9)

describe('Build time', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })

  it('should ignore files in _assets already', async () => {
    const files = {
      '/_assets/some.file': EXAMPLES.HTML,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build({}, proto_fab)
    expect(proto_fab._getEntries()).to.deep.equal([...Object.entries(files)])
  })

  it('should ignore server file', async () => {
    const files = {
      '/server.js': '< some contents >',
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build({}, proto_fab)
    expect(proto_fab._getEntries()).to.deep.equal([...Object.entries(files)])
  })

  it('should inline small files by default', async () => {
    const files = {
      '/index.html': EXAMPLES.HTML,
      '/main.css': EXAMPLES.CSS,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build({}, proto_fab)
    expect(proto_fab._getEntries()).to.deep.equal([])
    expect(proto_fab.metadata.rewire_assets.inlined_assets).to.deep.equal({
      '/index.html': {
        contents: EXAMPLES.HTML,
        content_type: 'text/html; charset=utf-8',
        immutable: false,
      },
      '/main.css': {
        contents: EXAMPLES.CSS,
        content_type: 'text/css; charset=utf-8',
        immutable: false,
      },
    })
  })

  it('should rewrite files larger than the threshold', async () => {
    const files = {
      '/index.html': EXAMPLES.HTML,
      '/main.css': EXAMPLES.CSS,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build(
      {
        'inline-threshold': EXAMPLES.CSS.length - 1,
      },
      proto_fab
    )

    expect(proto_fab._getEntries()).to.deep.equal([
      [`/_assets/main.${css_hash}.css`, EXAMPLES.CSS],
    ])
    expect(proto_fab.metadata.rewire_assets.inlined_assets).to.deep.equal({
      '/index.html': {
        contents: EXAMPLES.HTML,
        content_type: 'text/html; charset=utf-8',
        immutable: false,
      },
    })

    expect(proto_fab.metadata.rewire_assets.renamed_assets).to.deep.equal({
      '/main.css': {
        asset_path: `/_assets/main.${css_hash}.css`,
        immutable: false,
      },
    })
  })

  it('should base immutability decision based on filename', async () => {
    const files = {
      '/index.a1b2c3d4.html': EXAMPLES.HTML,
      '/main.e5f6a7b8.css': EXAMPLES.CSS,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build(
      {
        'inline-threshold': EXAMPLES.CSS.length - 1,
        'treat-as-immutable': /\.[0-9A-F]{8,}\./i,
      },
      proto_fab
    )

    expect(proto_fab._getEntries()).to.deep.equal([
      [`/_assets/main.e5f6a7b8.css`, EXAMPLES.CSS],
    ])
    expect(proto_fab.metadata.rewire_assets.inlined_assets).to.deep.equal({
      '/index.a1b2c3d4.html': {
        contents: EXAMPLES.HTML,
        content_type: 'text/html; charset=utf-8',
        immutable: true,
      },
    })

    expect(proto_fab.metadata.rewire_assets.renamed_assets).to.deep.equal({
      '/main.e5f6a7b8.css': {
        asset_path: `/_assets/main.e5f6a7b8.css`,
        immutable: true,
      },
    })
  })

  it('should allow bare hexadecimal paths', async () => {
    const files = {
      '/a1b2c3d4.html': EXAMPLES.HTML,
      '/e5f6a7b8.css': EXAMPLES.CSS,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build(
      {
        'inline-threshold': EXAMPLES.CSS.length - 1,
      },
      proto_fab
    )

    expect(proto_fab._getEntries()).to.deep.equal([
      [`/_assets/e5f6a7b8.css`, EXAMPLES.CSS],
    ])
    expect(proto_fab.metadata.rewire_assets.inlined_assets).to.deep.equal({
      '/a1b2c3d4.html': {
        contents: EXAMPLES.HTML,
        content_type: 'text/html; charset=utf-8',
        immutable: true,
      },
    })

    expect(proto_fab.metadata.rewire_assets.renamed_assets).to.deep.equal({
      '/e5f6a7b8.css': {
        asset_path: `/_assets/e5f6a7b8.css`,
        immutable: true,
      },
    })
  })

  it('should handle files without any extension', async () => {
    const files = {
      '/_index': EXAMPLES.HTML,
      '/_main': EXAMPLES.CSS,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build(
      {
        'inline-threshold': EXAMPLES.CSS.length - 1,
        'treat-as-immutable': /\.[0-9A-F]{8,}\./i,
      },
      proto_fab
    )

    expect(proto_fab._getEntries()).to.deep.equal([
      [`/_assets/_main_${css_hash}`, EXAMPLES.CSS],
    ])
    expect(proto_fab.metadata.rewire_assets.inlined_assets).to.deep.equal({
      '/_index': {
        contents: EXAMPLES.HTML,
        content_type: 'text/html; charset=utf-8',
        immutable: false,
      },
    })

    expect(proto_fab.metadata.rewire_assets.renamed_assets).to.deep.equal({
      '/_main': {
        asset_path: `/_assets/_main_${css_hash}`,
        immutable: false,
      },
    })
  })
})
