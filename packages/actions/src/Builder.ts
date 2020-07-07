import { LoadedPlugin, RuntimePlugin, FabConfig, ProtoFab } from '@fab/core'
import { Compiler } from './Compiler'
import { Generator } from './Generator'
import { Typecheck } from './Typecheck'
import {
  _log,
  BuildFailedError,
  InvalidConfigError,
  isRelative,
  relativeToConfig,
} from '@fab/cli'
import * as path from 'path'

const log = _log('Builder')

const safeResolve = (path: string, config_path: string) => {
  try {
    return require.resolve(path, { paths: [config_path] })
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

export default class Builder {
  static async build(
    config_path: string,
    config: FabConfig,
    skip_cache: boolean,
    skip_typecheck: boolean
  ) {
    log.announce(`fab build`)
    log(`Reading plugins from config.`)
    const plugins = await this.getPlugins(config_path, config)

    log.time(`Proceeding with build phase.`)

    const proto_fab = new ProtoFab()

    const runtime_plugins: RuntimePlugin[] = []
    for (const plugin of plugins) {
      const { plugin_name, builder, runtime, plugin_args } = plugin
      // @ts-ignore this guard isn't narrowing the type properly
      if (runtime) runtime_plugins.push(plugin)

      if (!builder) continue
      log(`Building 💛${plugin_name}💛:`)

      const dynamic_runtimes = await builder(
        plugin_args,
        proto_fab,
        config_path,
        skip_cache
      )

      if (Array.isArray(dynamic_runtimes)) {
        log(
          `Registering additional runtime plugin(s):💛${dynamic_runtimes
            .map((p) => p.runtime)
            .filter(Boolean)
            .join('\n')}💛`
        )

        for (const dynamic_runtime of dynamic_runtimes) {
          const path = safeResolve(
            relativeToConfig(config_path, dynamic_runtime.runtime),
            config_path
          )
          if (!path) {
            log.error(`WARNING: cannot resolve ${dynamic_runtime.runtime}! Skipping!`)
          } else {
            runtime_plugins.push(dynamic_runtime)
          }
        }
      }
    }

    log.time((d) => `Build plugins completed in ${d}.`)

    const typecheck = Typecheck.startTypecheck(
      config_path,
      runtime_plugins,
      skip_typecheck
    )
    await Compiler.compile(config, proto_fab, runtime_plugins)
    await typecheck.waitForResults()
    await Generator.generate(proto_fab)
  }

  static async getPlugins(
    config_path: string,
    config: FabConfig
  ): Promise<LoadedPlugin[]> {
    const plugins: LoadedPlugin[] = []

    for (const [plugin_name, plugin_args] of Object.entries(config.plugins)) {
      const is_relative = isRelative(plugin_name)
      const relative_path = relativeToConfig(config_path, plugin_name)
      const relative_slash_build = relative_path + '/build'
      const relative_slash_require = relative_path + '/runtime'
      const plugin_path = safeResolve(relative_path, config_path)
      const path_slash_build = safeResolve(relative_slash_build, config_path)
      const path_slash_require = safeResolve(relative_slash_require, config_path)

      // console.log({ is_relative, plugin_path, relative_path, path_slash_require })

      const plugin: LoadedPlugin = {
        plugin_name,
        plugin_args,
        builder: undefined,
        runtime: undefined,
      }

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
            plugin.builder = module.build
          }
        }

        if (path_slash_require) {
          plugin.runtime = path_slash_require
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

          plugin.runtime = plugin_path
        } else {
          if (typeof module.default === 'function') {
            plugin.runtime = plugin_path
          } else {
            log.warn(`Plugin ${plugin_name} doesn't have a default export, ignoring it.`)
          }
        }
      }

      plugins.push(plugin)
    }

    log(`Found the following 💛build-time💛 plugins:
    🖤${plugins
      .filter((p) => p.builder)
      .map((p) => p.plugin_name)
      .join('\n')}🖤`)
    log(`and the following 💛runtime💛 plugins:
    🖤${plugins
      .filter((p) => p.runtime)
      .map((p) => path.relative(process.cwd(), p.runtime!))
      .join('\n')}🖤`)

    return plugins
  }
}
