import { _log } from '@fab/cli'
import execa from 'execa'
import path from 'path'
import tmp from 'tmp-promise'
import fs from 'fs-extra'
import { RuntimePlugin } from '@fab/core'

const log = _log('Typecheck')

export class Typecheck {
  static startTypecheck(
    config_path: string,
    plugins: RuntimePlugin[],
    skip_typecheck: boolean
  ) {
    if (skip_typecheck) {
      log(`🖤Skipping.🖤`)
      return Typecheck.Noop
    }

    const ts_plugins = plugins.map((p) => p.runtime).filter((r) => r.match(/\.tsx?$/))

    if (ts_plugins.length === 0) {
      log(`🖤No Typescript plugins detected. Skipping.🖤`)
      return Typecheck.Noop
    }

    return new Typecheck(path.dirname(config_path), ts_plugins)
  }

  promise: Promise<any> | undefined

  constructor(cwd: string, plugins: string[]) {
    log(`Typechecking ${plugins.length} plugins (in background)...`)

    this.promise = (async () => {
      const dir = await tmp.dir()
      const tsconfig_path = path.join(dir.path, 'fab-tsconfig.json')
      const tsconfig = {
        compilerOptions: {
          target: 'es2020',
          module: 'commonjs',
          lib: ['es2020', 'dom'],
          declaration: false,
          sourceMap: false,
          strict: true,
          noImplicitReturns: false,
          noFallthroughCasesInSwitch: true,
          moduleResolution: 'node',
          baseUrl: './',
          paths: {},
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
        },
        include: plugins,
        exclude: [],
      }
      await fs.writeFile(tsconfig_path, JSON.stringify(tsconfig, null, 2))
      return execa('tsc', ['--pretty', '--noEmit', '-p', tsconfig_path], { cwd })
    })()
  }

  async waitForResults() {
    try {
      log(`Waiting for results. Pass 💛--skip-typecheck💛 to skip this step in future.`)
      await this.promise
      log.tick(`Typecheck passed.`)
    } catch (e) {
      if (process.env.CI) {
        throw e
      } else {
        log.cross(`Typecheck failed:`)
        console.log(e.stdout)
        log.note(
          `Treating errors as 💛warnings💛.\nSet environment variable 💛CI=true💛 to fail the build on type errors.`
        )
      }
    }
  }

  static Noop: Typecheck = {
    promise: undefined,
    async waitForResults() {},
  }
}
