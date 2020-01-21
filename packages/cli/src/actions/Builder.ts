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
import { rollupCompile } from '../helpers/rollup'
// @ts-ignore
import nodeEval from 'node-eval'

const safeResolve = (path: string) => {
  try {
    return require.resolve(path)
  } catch (e) {
    return null
  }
}

const safeRequire = async (path: string) => {
  try {
    return require(path)
  } catch (e) {
    try {
      const {
        output: [output, ...chunks],
      } = await rollupCompile(path, { format: 'cjs', exports: 'named' })
      return nodeEval(output.code)
    } catch (e) {
      return null
    }
  }
}

type BuildPlugin = {
  plugin_name: string
  builder: FabBuildStep
  plugin_args: PluginArgs
}
type Plugins = {
  build_plugins: BuildPlugin[]
  runtime_plugins: string[]
}

export default class Builder {
  static async build(config_path: string, config: FabConfig) {
    const { build_plugins, runtime_plugins } = await this.getPlugins(config_path, config)

    const proto_fab = new ProtoFab()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      console.log(`Building ${plugin_name}:`)
      await builder(plugin_args, proto_fab)
    }
    console.log([runtime_plugins])
    await Compiler.compile(proto_fab, runtime_plugins)
    await Generator.generate(proto_fab)
  }

  static async getPlugins(config_path: string, config: FabConfig): Promise<Plugins> {
    const build_plugins: BuildPlugin[] = []
    const runtime_plugins: string[] = []

    for (const [plugin_name, plugin_args] of Object.entries(config.plugins)) {
      const is_relative = isRelative(plugin_name)
      const relative_path = relativeToConfig(config_path, plugin_name)
      const plugin_path = safeResolve(relative_path)
      const relative_slash_require = relative_path + '/runtime'
      const path_slash_require = safeResolve(relative_slash_require)
      console.log({ is_relative, plugin_path, relative_path, path_slash_require })

      let runtime_plugin, build_plugin

      if (!plugin_path && !path_slash_require) {
        throw is_relative
          ? new InvalidConfigError(
              `The plugin '${plugin_name}' could not be found!\n` +
                `Looked for ${relative_slash_require} & ${relative_path}`
            )
          : new InvalidConfigError(
              `Cannot find module '${plugin_name}', which was referenced in the 'plugins' config.\nAre you sure it's installed?`
            )
      }

      if (path_slash_require) {
        const module_slash_require = await safeRequire(path_slash_require)
        console.log(module_slash_require)
        console.log(module_slash_require.runtime)
        console.log(typeof module_slash_require.runtime)
        if (typeof module_slash_require.runtime === 'function') {
          runtime_plugin = path_slash_require
        } else {
          log.warn(
            `Requiring '${relative_slash_require}' didn't export a 'runtime' function, but the filename indicates it probably should. Falling back to '${plugin_path}'`
          )
        }
      }

      if (plugin_path) {
        const module = await safeRequire(plugin_path)

        if (typeof module.build === 'function') {
          build_plugin = {
            plugin_name,
            builder: module.build,
            plugin_args,
          }
        }
        if (typeof module.runtime === 'function') {
          if (runtime_plugin) {
            log.warn(
              `Plugin ${plugin_name} exports a 'runtime' function, but we've already loaded it from '${path_slash_require}'.`
            )
          } else {
            runtime_plugin = path_slash_require
          }
        }
      }

      if (!runtime_plugin && !build_plugin) {
        log.warn(
          `Plugin ${plugin_name} exports neither a "build" or "runtime" export, ignoring it.`
        )
      }

      if (runtime_plugin) runtime_plugins.push(runtime_plugin)
      if (build_plugin) build_plugins.push(build_plugin)
    }

    return { build_plugins, runtime_plugins }
  }
}
