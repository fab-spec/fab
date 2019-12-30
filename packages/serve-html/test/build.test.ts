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

  it('should compile the HTML files into a template', async () => {
    const files = {
      '/index.html':
        '<html><head><title>HTML Test</title></head><body>here</body></html>',
    }
    const proto_fab = new ProtoFab<ServeHtmlMetadata>(files)
    await build({}, proto_fab)
    const htmls = proto_fab.metadata.serve_html.htmls
    expect(Object.keys(htmls)).to.deep.equal(['/index.html'])
    expect(htmls['/index.html'].map((tokens) => tokens[1])).to.deep.equal([
      '<html><head>',
      'FAB_ENV_INJECTION',
      '<title>HTML Test</title></head><body>here</body></html>',
    ])
  })

  it(`should not make room for FAB_SETTINGS if 'env' isn't passed`, async () => {
    const files = {
      '/index.html':
        '<html><head><title>HTML Test</title></head><body>here</body></html>',
    }
    const proto_fab = new ProtoFab<ServeHtmlMetadata>(files)
    await build(
      {
        injections: {},
      },
      proto_fab
    )
    const htmls = proto_fab.metadata.serve_html.htmls
    expect(Object.keys(htmls)).to.deep.equal(['/index.html'])
    expect(htmls['/index.html'].map((tokens) => tokens[1])).to.deep.equal([
      '<html><head><title>HTML Test</title></head><body>here</body></html>',
    ])
  })

  it(`should explode if you try to use an injection it doesn't know about`, async () => {
    const proto_fab = new ProtoFab<ServeHtmlMetadata>()
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
