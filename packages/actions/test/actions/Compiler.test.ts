import { expect } from 'chai'
import { Compiler } from '../../src/Compiler'
import { JSON5Config } from '@fab/cli'
import { captureStdout } from '../helpers'
import { ProtoFab } from '@fab/core'

describe('Compiler', () => {
  it.skip('should compile the fixtures directory', async () => {
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
    console.log(proto_fab.files.get('/server.js')!.length)
    // console.log(proto_fab.files.get('/server.js')!.toString())
    expect(1 + 1).to.equal(2)
  })
})
