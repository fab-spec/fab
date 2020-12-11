import { expect } from 'chai'
import { ProtoFab } from '@fab/core'
import hasha from 'hasha'
import { RewireAssetsMetadata } from '../src/types'
import { build } from '../src/build'

const EXAMPLES = {
  HTML: '< some contents >',
  CSS: 'body { font-family: Comic Sans MS; font-size: 48px; }',
  BIG_HTML: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Lorem Ipsum</title>
</head>
<body>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum ipsum convallis urna vulputate molestie. In aliquam feugiat justo, at laoreet libero facilisis vitae. Vestibulum ultrices at nisl non feugiat. Aliquam mattis libero eget erat feugiat, quis sollicitudin magna pharetra. Aenean eget egestas ligula. Duis feugiat, eros vitae porttitor venenatis, est arcu blandit dui, id aliquet lacus lacus at nunc. Aenean lacinia dictum elit ut tempus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quis arcu enim.
    Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque feugiat vestibulum tortor, non porta orci rhoncus a. Cras feugiat suscipit elementum. Proin nisl ex, facilisis id ultricies eget, venenatis id neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacinia lacinia malesuada. Integer nec facilisis dui. Aenean sed neque sed leo imperdiet mollis. Proin accumsan gravida nisl, quis ultricies ante dictum tristique. Nullam non sapien eu arcu aliquet vulputate. Sed a ligula ipsum. Morbi interdum nunc magna, ut vulputate dolor porttitor ac. Maecenas est sem, pretium nec scelerisque id, faucibus eu diam. Integer fermentum sed libero quis semper.
    Mauris at nisi et leo mollis dapibus vel vestibulum ipsum. Donec placerat nec ante eget mollis. Donec maximus quis ex ac porttitor. Cras nec quam sed libero hendrerit mollis. Nam vitae lacinia ante. Etiam tempor quis enim a tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent fermentum semper purus at ultrices. Nullam convallis magna sed eros consectetur egestas. In hac habitasse platea dictumst. Mauris condimentum nisl nisl, nec tincidunt dui elementum a. Donec malesuada imperdiet maximus. Vivamus aliquet nisl non ex egestas tincidunt. Suspendisse eget mi maximus, volutpat justo interdum, porttitor ipsum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin sagittis condimentum porta.
    Vestibulum non iaculis tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent mollis eros non quam tincidunt, vitae fringilla massa venenatis. Integer quam dolor, tristique in congue sed, tristique in velit. Vestibulum nec aliquet mauris. Etiam efficitur pretium mi volutpat fringilla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam nisi turpis, eleifend elementum volutpat vitae, volutpat quis nibh. Aenean congue molestie tortor. Nulla volutpat ante arcu, ut sagittis ipsum venenatis non. Suspendisse fringilla odio quis velit dignissim, id ultricies quam accumsan. Curabitur et sagittis mi. Phasellus eget dolor congue, rhoncus libero non, dictum orci. Quisque condimentum mollis nibh, a ultrices orci semper a. Morbi eget metus felis.
    Nulla magna ex, pellentesque in varius vel, fermentum quis nibh. Curabitur blandit est imperdiet dictum efficitur. Duis ac nisl id eros eleifend euismod. Cras tincidunt leo ex, vel pulvinar diam sagittis vel. Etiam facilisis arcu et facilisis imperdiet. Donec ligula nibh, euismod quis suscipit non, laoreet eget odio. Phasellus congue nulla neque, et semper risus ullamcorper vel. Aliquam erat volutpat. Nunc erat quam, porttitor vitae cursus ac, porttitor eu velit. Curabitur ac faucibus erat. Nulla eu pellentesque magna. Proin laoreet vestibulum aliquet. Duis accumsan condimentum dui, non mollis ipsum sagittis ac. Praesent at magna tincidunt, commodo justo placerat, tempus diam. Proin a magna bibendum velit fermentum commodo.
  </p>
</body>
</html>
`,
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
        'inline-threshold': Buffer.byteLength(EXAMPLES.CSS, 'utf-8') - 1,
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
        chunks_paths: [`/_assets/main.${css_hash}.css`],
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
        'inline-threshold': Buffer.byteLength(EXAMPLES.CSS, 'utf-8') - 1,
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
        chunks_paths: [`/_assets/main.e5f6a7b8.css`],
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
        'inline-threshold': Buffer.byteLength(EXAMPLES.CSS, 'utf-8') - 1,
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
        chunks_paths: [`/_assets/e5f6a7b8.css`],
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
        'inline-threshold': Buffer.byteLength(EXAMPLES.CSS, 'utf-8') - 1,
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
        chunks_paths: [`/_assets/_main_${css_hash}`],
        immutable: false,
      },
    })
  })

  it('should chunk files appropriately when chunk-threshold is provided', async () => {
    const files = {
      '/_index': EXAMPLES.BIG_HTML,
    }
    const proto_fab = new ProtoFab<RewireAssetsMetadata>(files)
    const chunk_threshold = 2000
    await build(
      {
        'inline-threshold': 0,
        'chunk-threshold': chunk_threshold,
      },
      proto_fab
    )

    const { chunks_paths } = proto_fab.metadata.rewire_assets.renamed_assets['/_index']
    const byte_size = Buffer.byteLength(EXAMPLES.BIG_HTML, 'utf-8')
    expect(chunks_paths.length).to.equal(Math.ceil(byte_size / chunk_threshold))

    const file_map = Object.fromEntries(proto_fab._getEntries())
    const reassembled_contents = chunks_paths
      .map((chunk_path) => file_map[chunk_path])
      .reduce((contents, chunk_contents) => contents + chunk_contents)
    expect(reassembled_contents).to.equal(EXAMPLES.BIG_HTML)
  })
})
