import { FabBuildStep, FabConfig, PluginArgs, ProtoFab } from '@fab/core'
import { Compiler } from './Compiler'
import { Generator } from './Generator'
import { isRelative, relativeToConfig } from '../helpers/paths'
import { BuildFailedError, InvalidConfigError } from '../errors'
import { log } from '../helpers'
import Rollup from '../helpers/rollup'

const safeResolve = (path: string) => {
  try {
    return require.resolve(path)
  } catch (e) {
    return null
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
    const rollup = new Rollup(config)
    const { build_plugins, runtime_plugins } = await this.getPlugins(
      config_path,
      config,
      rollup
    )

    const proto_fab = new ProtoFab()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      console.log(`Building ${plugin_name}:`)
      await builder(plugin_args, proto_fab)
    }
    console.log([runtime_plugins])
    await Compiler.compile(proto_fab, runtime_plugins, rollup)
    await Generator.generate(proto_fab)
  }

  static async getPlugins(
    config_path: string,
    config: FabConfig,
    rollup: Rollup
  ): Promise<Plugins> {
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
        const module_slash_require = await rollup.compileAndRequire(path_slash_require)
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
        const module = (await rollup.compileAndRequire(plugin_path)) || {}
        console.log(module)
        console.log(module.runtime)
        console.log(typeof module.runtime)

        if (typeof module.build === 'function') {
          build_plugin = {
            plugin_name,
            builder: module.build,
            plugin_args,
          }
        }
        if (typeof module.runtime === 'function') {
          console.log('GOT RUNTIME')
          if (runtime_plugin) {
            log.warn(
              `Plugin ${plugin_name} exports a 'runtime' function, but we've already loaded it from '${path_slash_require}'.`
            )
          } else {
            runtime_plugin = plugin_path
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
