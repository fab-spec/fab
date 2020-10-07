import {
  LoadedPlugin,
  RuntimePlugin,
  FabConfig,
  ProtoFab,
  BuildConfig,
  PluginLoadResult,
} from '@fab/core'
import { Compiler } from './Compiler'
import { BuildPluginCompiler } from './BuildPluginCompiler'
import { Generator } from './Generator'
import { Typecheck } from './Typecheck'
import { _log, InvalidConfigError, isRelative, relativeToConfig } from '@fab/cli'
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
    skip_cache: boolean = false,
    skip_typecheck: boolean = false,
    minify: boolean = false
  ) {
    log.announce(`fab build`)
    log(`Reading plugins from config.`)
    const {
      runtime_plugins: loaded_runtime_plugins,
      build_plugins: loaded_build_plugins,
    } = await this.getPlugins(config_path, config)

    log.time(`Proceeding with build phase.`)

    const proto_fab = new ProtoFab()

    const runtime_plugins = loaded_runtime_plugins.map((plugin) => ({
      runtime: plugin.runtime!,
      plugin_args: plugin.plugin_args,
    }))

    const build_plugins = loaded_build_plugins.map((plugin) => ({
      builder: plugin.builder!,
      plugin_args: plugin.plugin_args,
    }))

    const dynamic_runtime_directives = await BuildPluginCompiler.compileAndExecute(
      proto_fab,
      build_plugins,
      config_path,
      skip_cache
    )

    log.time((d) => `Build plugins completed in ${d}.`)

    if (Array.isArray(dynamic_runtime_directives)) {
      const dynamic_config: FabConfig = {
        plugins: dynamic_runtime_directives.reduce(
          (accumulator: BuildConfig, plugin: RuntimePlugin) => {
            accumulator[plugin.runtime] = plugin.plugin_args
            return accumulator
          },
          {}
        ),
      }

      const {
        build_plugins: dynamic_build_plugins,
        runtime_plugins: dynamic_runtime_plugins,
      } = await this.getPlugins(config_path, dynamic_config)

      if (dynamic_runtime_plugins.length) {
        log(
          `Registering additional runtime plugin(s):
        💛${dynamic_runtime_plugins
          .map((p) => path.relative(path.dirname(config_path), p.runtime!))
          .filter(Boolean)
          .join('\n')}💛`
        )

        const dynamic_runtimes: RuntimePlugin[] = dynamic_runtime_plugins.map(
          (dynamic_plugin) => ({
            runtime: dynamic_plugin.runtime!,
            plugin_args: dynamic_plugin.plugin_args,
          })
        )

        runtime_plugins.splice(runtime_plugins.length, 0, ...dynamic_runtimes)
      }

      if (dynamic_build_plugins.length) {
        log.error(
          `WARNING: cannot dynamically add build plugin(s):
          ❤️${dynamic_build_plugins
            .map((p) => path.relative(path.dirname(config_path), p.builder!))
            .filter(Boolean)
            .join('\n')}❤️`
        )
      }
    }

    const buildPluginTypecheck = Typecheck.startTypecheck(
      config_path,
      build_plugins.map((plugin) => plugin.builder),
      skip_typecheck
    )

    const runtimePluginTypecheck = Typecheck.startTypecheck(
      config_path,
      runtime_plugins.map((plugin) => plugin.runtime),
      skip_typecheck
    )

    await Compiler.compile(config, proto_fab, runtime_plugins, minify)
    await Promise.all([
      buildPluginTypecheck.waitForResults(),
      runtimePluginTypecheck.waitForResults(),
    ])
    await Generator.generate(proto_fab)
  }

  static async getPlugins(
    config_path: string,
    config: FabConfig
  ): Promise<PluginLoadResult> {
    const plugins: LoadedPlugin[] = []

    for (const [plugin_name, plugin_args] of Object.entries(config.plugins)) {
      const is_relative = isRelative(plugin_name)
      const relative_path = relativeToConfig(config_path, plugin_name)
      const relative_slash_build = relative_path + '/build'
      const relative_slash_runtime = relative_path + '/runtime'
      const plugin_path =
        safeResolve(relative_path, config_path) ||
        safeResolve(relative_path + '.ts', config_path)
      const path_slash_build =
        safeResolve(relative_slash_build, config_path) ||
        safeResolve(relative_slash_build + '.ts', config_path)
      const path_slash_runtime =
        safeResolve(relative_slash_runtime, config_path) ||
        safeResolve(relative_slash_runtime + '.ts', config_path)

      // console.log({ is_relative, plugin_path, relative_path, path_slash_require })

      const plugin: LoadedPlugin = {
        plugin_name,
        plugin_args,
        builder: undefined,
        runtime: undefined,
      }

      if (path_slash_build || path_slash_runtime) {
        if (plugin_path) {
          const found_paths = [path_slash_build, path_slash_runtime].filter((x) => x)
          log.warn(
            `For plugin '${plugin_name}', we found ${found_paths.join(
              ' & '
            )}, but also ${relative_path} resolved to ${plugin_path}.
            This won't be used, as /build and /runtime resolutions take precedence.
            See https://fab.dev/kb/plugins#plugin-resolution for more info.`
          )
        }

        if (path_slash_build) {
          plugin.builder = path_slash_build
        }

        if (path_slash_runtime) {
          plugin.runtime = path_slash_runtime
        }
      } else {
        if (!plugin_path) {
          throw is_relative
            ? new InvalidConfigError(
                `The plugin '${plugin_name}' could not be found!\n` +
                  `Looked for ${relative_slash_build}, ${relative_slash_runtime} & ${relative_path}`
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

    const build_plugins = plugins.filter((p) => p.builder)
    const runtime_plugins = plugins.filter((p) => p.runtime)

    if (build_plugins.length) {
      log(`Found the following 💛build-time💛 plugins:
        🖤${build_plugins.map((p) => p.plugin_name).join('\n')}🖤`)
    }

    if (runtime_plugins.length) {
      log(`Found the following 💛runtime💛 plugins:
        🖤${runtime_plugins.map((p) => p.plugin_name).join('\n')}🖤`)
    }

    return { plugins, build_plugins, runtime_plugins }
  }
}
