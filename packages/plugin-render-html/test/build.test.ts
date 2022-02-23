import { expect } from 'chai'
import { ProtoFab } from '@dev-spendesk/core'
import { build } from '../src/build'
import { RenderHtmlMetadata } from '../src/types'

describe('Build time', () => {
  it('should be a function', () => {
    expect(build).to.be.a('function')
  })

  it('should ignore non-HTML files', async () => {
    const files = {
      '/main.css': 'some { css: here; }',
    }
    const proto_fab = new ProtoFab<RenderHtmlMetadata>(files)
    await build({}, proto_fab)
    expect(proto_fab._getEntries()).to.deep.equal([...Object.entries(files)])
  })

  it('should remove HTML files from the list', async () => {
    const files = {
      '/index.html': '<html>here</html>',
    }
    const proto_fab = new ProtoFab<RenderHtmlMetadata>(files)
    await build({}, proto_fab)
    expect(proto_fab._getEntries()).to.deep.equal([])
  })

  it('should not inline anything if no fallback given', async () => {
    const files = {
      '/index.html': '<html>here</html>',
    }
    const proto_fab = new ProtoFab<RenderHtmlMetadata>(files)
    await build({ fallback: false }, proto_fab)
    expect([...proto_fab.files.keys()]).to.deep.equal([
      '/_assets/_html/index.html.9684b38c1.json',
    ])
  })

  it('should inline everything if specified', async () => {
    const files = {
      '/foo.html': '<html>here</html>',
      '/bar.html': '<html>also</html>',
    }
    const proto_fab = new ProtoFab<RenderHtmlMetadata>(files)
    await build({ fallback: false, inline: true }, proto_fab)
    expect([...proto_fab.files.keys()]).to.deep.equal([])
  })

  it('should compile the HTML files into a template', async () => {
    const files = {
      '/index.html':
        '<html><head><title>HTML Test</title></head><body>here</body></html>',
    }
    const proto_fab = new ProtoFab<RenderHtmlMetadata>(files)
    await build({}, proto_fab)
    const htmls = proto_fab.metadata.render_html.inlined_htmls
    expect(Object.keys(htmls)).to.deep.equal(['/index.html'])
    expect(htmls['/index.html']).to.deep.equal({
      strings: [
        '<html><head>',
        '<title>HTML Test</title></head><body>here</body></html>',
      ],
      varNames: ['FAB_ENV_INJECTION'],
    })
  })

  it(`should not make room for FAB_SETTINGS if 'env' isn't passed`, async () => {
    const files = {
      '/index.html':
        '<html><head><title>HTML Test</title></head><body>here</body></html>',
    }
    const proto_fab = new ProtoFab<RenderHtmlMetadata>(files)
    await build(
      {
        injections: {},
      },
      proto_fab
    )
    const htmls = proto_fab.metadata.render_html.inlined_htmls
    expect(Object.keys(htmls)).to.deep.equal(['/index.html'])

    expect(htmls['/index.html']).to.deep.equal({
      strings: ['<html><head><title>HTML Test</title></head><body>here</body></html>'],
      varNames: [],
    })
  })

  it(`should explode if you try to use an injection it doesn't know about`, async () => {
    const proto_fab = new ProtoFab<RenderHtmlMetadata>()
    await build(
      {
        injections: {
          // @ts-ignore
          'no-existo': {},
        },
      },
      proto_fab
    )
  })
})
