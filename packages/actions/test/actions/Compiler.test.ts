import { expect } from 'chai'
import { Compiler } from '../../src/Compiler'
import { JSON5Config } from '@dev-spendesk/cli'
import { captureStdout } from '../helpers'
import { ProtoFab } from '@dev-spendesk/core'

describe('Compiler', function() {
  this.timeout(10000)

  const sizes: {
    non_minified?: number
    minified?: number
  } = {}

  const checkSizes = () => {
    // Only check once both have run
    if (
      typeof sizes.non_minified !== 'undefined' &&
      typeof sizes.minified !== 'undefined'
    ) {
      expect(sizes.non_minified).to.be.greaterThan(0)
      expect(sizes.minified).to.be.greaterThan(0)
      expect(sizes.minified).to.be.lessThan(sizes.non_minified)
    }
  }

  it('should compile the fixtures directory', async () => {
    const local_plugins = `${__dirname}/../fixtures/fab.local-plugins.json5`

    const proto_fab = new ProtoFab()
    const { stdout, result } = await captureStdout(
      async () =>
        await Compiler.compile(
          (await JSON5Config.readFrom(local_plugins)).data,
          proto_fab,
          []
        )
    )

    console.log(stdout)
    console.log(proto_fab.files)

    sizes.non_minified = proto_fab.files.get('/server.js')!.length
    console.log(sizes)
    checkSizes()
  })

  it('should compile the fixtures directory with minification', async () => {
    const local_plugins = `${__dirname}/../fixtures/fab.local-plugins.json5`

    const proto_fab = new ProtoFab()
    const { stdout, result } = await captureStdout(
      async () =>
        await Compiler.compile(
          (await JSON5Config.readFrom(local_plugins)).data,
          proto_fab,
          [],
          true
        )
    )

    console.log(stdout)
    console.log(proto_fab.files)

    sizes.minified = proto_fab.files.get('/server.js')!.length
    console.log(sizes)
    checkSizes()
  })
})
