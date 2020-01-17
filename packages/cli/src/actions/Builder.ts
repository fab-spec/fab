import {
  FabBuildStep,
  FabConfig,
  FabPluginRuntime,
  PluginArgs,
  PluginMetadata,
  ProtoFab,
  s_sume,
} from '@fab/core'
import { Compiler } from './Compiler'
import { Generator } from './Generator'
import { isRelative, relativeToConfig } from '../helpers/paths'
import { InvalidConfigError, InvalidPluginError } from '../errors'
import { log } from '../helpers'

type RuntimePlugin = {
  path: string
  runtime: FabPluginRuntime<PluginArgs, PluginMetadata>
}

const safeRequire = (path: string) => {
  try {
    return require(path)
  } catch (e) {
    return null
  }
}

export default class Builder {
  static async build(config_path: string, config: FabConfig) {
    const build_plugins: Array<{
      plugin_name: string
      builder: FabBuildStep
      plugin_args: PluginArgs
    }> = []
    const runtime_plugins: Array<string> = []

    Object.entries(config.plugins).forEach(([plugin_name, plugin_args]) => {
      const is_relative = isRelative(plugin_name)
      const plugin_path = relativeToConfig(config_path, plugin_name)
      const path_slash_require = plugin_path + '/runtime'
      console.log({ is_relative, plugin_path, path_slash_require })

      const module_slash_require = safeRequire(path_slash_require)
      if (module_slash_require && !module_slash_require.runtime) {
        log.warn(
          `Requiring '${path_slash_require}' didn't export a 'runtime' function, but the filename indicates it probably should. Falling back to '${plugin_path}'`
        )
      }
      const module = safeRequire(plugin_path)
      if (!is_relative && !module) {
        throw new InvalidConfigError(
          `Cannot find module '${plugin_name}', which was referenced in the 'plugins' config.\nAre you sure it's installed?`
        )
      }
      if (!module_slash_require && !module)
        throw new InvalidConfigError(
          `The plugin '${plugin_name}' could not be found!\n` +
            `Looked for ${path_slash_require} first, then tried ${plugin_path}`
        )
      if (typeof module_slash_require?.runtime === 'function') {
        runtime_plugins.push(path_slash_require)
      } else if (typeof module?.runtime === 'function') {
        runtime_plugins.push(plugin_path)
      }

      if (typeof module?.build === 'function') {
        const builder = module.build as FabBuildStep<PluginArgs, PluginMetadata>
        build_plugins.push({
          plugin_name,
          builder,
          plugin_args,
        })
      }
    })

    const proto_fab = new ProtoFab()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      console.log(`Building ${plugin_name}:`)
      await builder(plugin_args, proto_fab)
    }

    console.log([runtime_plugins])
    await Compiler.compile(proto_fab, runtime_plugins)
    await Generator.generate(proto_fab)
  }
}
