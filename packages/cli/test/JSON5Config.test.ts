import { expect } from 'chai'
import JSON5Config from '../src/helpers/JSON5Config'

describe('JSON5Config', () => {
  it('should parse regexps in plugin args', () => {
    const config = new JSON5Config('', {
      build: {
        plugin: {
          regex: '/\\.[0-9A-F]{8,}\\./i',
        },
      },
    })
    const regex = config.data.build.plugin.regex as RegExp
    expect(regex).to.be.a('RegExp')
    expect('/foo.abcdef123456.js').to.match(regex)
    expect('/static/foo.abcdef123456.js').to.match(regex)
    expect('/static/foo.abcdef1234567890.js').to.match(regex)
    expect('/static/foo.abcdef1234567890abcdef1234567890.js').to.match(regex)
    expect('/foo.xyzabc123456.js').to.not.match(regex)
    expect('/foo.abc123.js').to.not.match(regex)
    expect('/abcdef123456.js').to.not.match(regex)
    expect('/foo.abcdef123456').to.not.match(regex)
  })

  it('should parse more specific regexps in plugin args', () => {
    const config = new JSON5Config('', {
      build: {
        plugin: {
          regex: '/\\/static\\/.*\\.[0-9A-F]{8,}\\./i',
        },
      },
    })
    const regex = config.data.build.plugin.regex as RegExp
    expect(regex).to.be.a('RegExp')
    expect('/foo.abcdef123456.js').to.not.match(regex)
    expect('/static/foo.abcdef123456.js').to.match(regex)
    expect('/static/foo.abcdef1234567890.js').to.match(regex)
    expect('/static/foo.abcdef1234567890abcdef1234567890.js').to.match(regex)
  })

  it('should not crash on numeric values', () => {
    const config = new JSON5Config('', {
      build: {
        plugin: {
          number: 123,
        },
      },
    })
    const regex = config.data.build.plugin.number as number
    expect(regex).to.be.a('Number')
    expect(regex).to.eq(123)
  })
})
