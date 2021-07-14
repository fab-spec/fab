import { expect } from 'chai'
import { BuildPluginCompiler } from '../../src/BuildPluginCompiler'
import Builder from '../../src/Builder'
import { JSON5Config } from '@fab/cli'
import { ProtoFab, BuildPlugin } from '@fab/core'

describe('BuildPluginCompiler', function() {
  it('should compile and execute the build plugins from the fixtures directory', async () => {
    const local_plugins = `${__dirname}/../fixtures/fab.local-plugins.json5`
    const config_path = `${__dirname}/../fixtures/fab.local-plugins.json5`

    const config = (await JSON5Config.readFrom(local_plugins)).data

    const { build_plugins } = await Builder.getPlugins(config_path, config)

    const expected_build_plugin_names = [
      'build-and-render',
      'build-only',
      'typescript-example',
      'build-with-dynamic-runtimes',
    ]

    build_plugins.forEach((plugin, index) => {
      expect(plugin.builder).to.have.string(expected_build_plugin_names[index])
    })

    const proto_fab = new ProtoFab()
    const dynamic_runtime_plugins = await BuildPluginCompiler.compileAndExecute(
      proto_fab,
      build_plugins as BuildPlugin[],
      config_path,
      false
    )

    expect(dynamic_runtime_plugins).to.deep.equal([
      {
        runtime: './plugins/foo',
        plugin_args: {
          somewhere: 'over the rainbow',
        },
      },
    ])
  })
})
