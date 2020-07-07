import { expect } from 'chai'
import Builder from '../../src/Builder'
import { JSON5Config } from '@fab/cli'
import path from 'path'
import { captureStdout } from '../helpers'

describe('Builder', () => {
  it('should find the local plugin', async () => {
    const no_runtime_config = `${__dirname}/../fixtures/fab.local-plugins.json5`

    const { stdout, result } = await captureStdout(
      async () =>
        await Builder.getPlugins(
          no_runtime_config,
          (await JSON5Config.readFrom(no_runtime_config)).data
        )
    )

    expect(
      result.map(({ plugin_name, builder, plugin_args, runtime }) => [
        plugin_name,
        plugin_args,
        !!builder,
        !!runtime,
      ])
    ).to.deep.equal([
      ['./plugins/build-and-render', { first: 'plugin' }, true, true],
      ['./plugins/build-only', { then: 'this one' }, true, false],
      ['./plugins/runtime-only', { thirdly: 'this' }, false, true],
      ['./plugins/empty', { set: 'it up' }, false, false],
      ['./plugins/typescript-example', { the_time_is: 'NOW!' }, true, true],
    ])
    expect(result.flatMap((p) => p.runtime || [])).to.deep.equal([
      path.resolve(`${__dirname}/../fixtures/plugins/build-and-render/runtime.js`),
      path.resolve(`${__dirname}/../fixtures/plugins/runtime-only.js`),
      path.resolve(`${__dirname}/../fixtures/plugins/typescript-example/runtime.ts`),
    ])
    expect(stdout).to.contain(
      `Plugin ./plugins/empty doesn't have a default export, ignoring it.`
    )
  })
})
