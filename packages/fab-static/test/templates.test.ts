import * as expect from 'expect'
import * as fs from 'fs-extra'
import * as prettier from 'prettier'

import HtmlCompiler from '../src/HtmlCompiler'

const html = (a: string) => prettier.format(a, { parser: 'html' })

describe('hello', () => {
  it('should inject FAB_ENV_INJECTION into a simple HTML file', async () => {
    const result = await HtmlCompiler.compile(__dirname + '/templates/a.in.html')
    const expected = await fs.readFile(__dirname + '/templates/a.out.html', 'utf8')
    expect(html(result)).toEqual(html(expected))
  })

  it('should inject FAB_NONCE into any script tags', async () => {
    const result = await HtmlCompiler.compile(__dirname + '/templates/b.in.html')
    const expected = await fs.readFile(__dirname + '/templates/b.out.html', 'utf8')
    expect(html(result)).toEqual(html(expected))
  })

  it('should escape any existing mustache templates and restore them', async () => {
    const result = await HtmlCompiler.compile(__dirname + '/templates/c.in.html')
    const expected = await fs.readFile(__dirname + '/templates/c.out.html', 'utf8')
    expect(html(result)).toEqual(html(expected))

    const rendered = HtmlCompiler.render(result, {
      FAB_ENV_INJECTION: `<script>console.log('hi')</script>`,
      FAB_NONCE: 'noncey'
    })
    const expected_render = await fs.readFile(__dirname + '/templates/c.rendered.html', 'utf8')
    expect(html(rendered)).toEqual(html(expected_render))
  })
})
