import { FabBuildStep, FabConfig, PluginArgs, ProtoFab } from '@fab/core'
import { Compiler } from './Compiler'
import { Generator } from './Generator'
import { log, isRelative, relativeToConfig } from '../helpers'
import { BuildFailedError, InvalidConfigError } from '../errors'
import { rollupCompile } from '../helpers/rollup'
// @ts-ignore
import nodeEval from 'node-eval'
import * as path from 'path'

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
    const { build_plugins, runtime_plugins } = await this.getPlugins(config_path, config)

    const proto_fab = new ProtoFab()
    for (const { plugin_name, builder, plugin_args } of build_plugins) {
      console.log(`Building ${plugin_name}:`)
      await builder(plugin_args, proto_fab, config_path)
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
      const relative_slash_build = relative_path + '/build'
      const relative_slash_require = relative_path + '/runtime'
      const plugin_path = safeResolve(relative_path)
      const path_slash_build = safeResolve(relative_slash_build)
      const path_slash_require = safeResolve(relative_slash_require)

      console.log({ is_relative, plugin_path, relative_path, path_slash_require })

      let runtime_plugin, build_plugin

      if (path_slash_build || path_slash_require) {
        if (plugin_path) {
          const found_paths = [path_slash_build, path_slash_require].filter((x) => x)
          log.warn(
            `For plugin '${plugin_name}', we found ${found_paths.join(
              ' & '
            )}, but also ${relative_path} resolved to ${plugin_path}.
            This won't be used, as /build and /runtime resolutions take precedence.
            See https://fab.dev/kb/plugins#plugin-resolution for more info.`
          )
        }

        if (path_slash_build) {
          const module = await safeRequire(path_slash_build)

          if (!module) {
            throw new BuildFailedError(
              `Error occurred requiring ${path_slash_build}.
              Maybe it's using syntax that NodeJS can't interpret?
              See https://fab.dev/kb/plugins#restrictions for more info.`
            )
          } else if (typeof module.build !== 'function') {
            throw new BuildFailedError(
              `Module ${path_slash_build} didn't export a 'build' function!`
            )
          } else {
            build_plugin = {
              plugin_name,
              builder: module.build,
              plugin_args,
            }
          }
        }

        if (path_slash_require) {
          runtime_plugin = path_slash_require
        }
      } else {
        if (!plugin_path) {
          throw is_relative
            ? new InvalidConfigError(
                `The plugin '${plugin_name}' could not be found!\n` +
                  `Looked for ${relative_slash_build}, ${relative_slash_require} & ${relative_path}`
              )
            : new InvalidConfigError(
                `Cannot find module '${plugin_name}', which was referenced in the 'plugins' config.\nAre you sure it's installed?`
              )
        }

        const module = await safeRequire(plugin_path)

        if (!module) {
          // This can happen if the plugin is runtime-only and uses non-CJS syntax,
          // so just pass it through as a runtime plugin.
          // Relevant issue: https://github.com/fab-spec/fab/issues/67
          runtime_plugin = plugin_path
        } else {
          if (typeof module.build === 'function') {
            build_plugin = {
              plugin_name,
              builder: module.build,
              plugin_args,
            }
          }
          if (typeof module.runtime === 'function') {
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
