import { expect } from 'chai'
import { PluginMetadata, ProtoFab } from '@fab/core'
import hasha from 'hasha'
import { RewireAssetsMetadata } from '../src/types'
import { build } from '../src/build'

const EXAMPLES = {
  HTML: '< some contents >',
  CSS: 'body { font-family: Comic Sans MS; font-size: 48px; }',
}

describe('Build time', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })

  it('should ignore files in _assets already', async () => {
    const files = {
      '_assets/some.file': EXAMPLES.HTML,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([...Object.entries(files)])
  })

  it('should ignore server file', async () => {
    const files = {
      'server.js': '< some contents >',
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([...Object.entries(files)])
  })

  it('should inline small files by default', async () => {
    const files = {
      'index.html': EXAMPLES.HTML,
      'main.css': EXAMPLES.CSS,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build({}, proto_fab)
    expect([...proto_fab.files.entries()]).to.deep.equal([])
    expect(proto_fab.metadata.rewire_assets.inlined_assets).to.deep.equal({
      'index.html': {
        contents: EXAMPLES.HTML,
        content_type: 'text/html; charset=utf-8',
      },
      'main.css': {
        contents: EXAMPLES.CSS,
        content_type: 'text/css; charset=utf-8',
      },
    })
  })

  it('should rewrite files larger than the threshold', async () => {
    const files = {
      'index.html': EXAMPLES.HTML,
      'main.css': EXAMPLES.CSS,
    }
    const css_hash = hasha(EXAMPLES.CSS, { algorithm: 'md5' }).slice(0, 9)
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    await build(
      {
        'inline-threshold': EXAMPLES.CSS.length - 1,
      },
      proto_fab
    )

    expect([...proto_fab.files.entries()]).to.deep.equal([
      [`_assets/main.${css_hash}.css`, EXAMPLES.CSS],
    ])
    expect(proto_fab.metadata.rewire_assets.inlined_assets).to.deep.equal({
      'index.html': {
        contents: EXAMPLES.HTML,
        content_type: 'text/html; charset=utf-8',
      },
    })

    expect(proto_fab.metadata.rewire_assets.renamed_assets).to.deep.equal({
      'main.css': {
        asset_path: `_assets/main.${css_hash}.css`,
        immutable: false,
      },
    })
  })
})
