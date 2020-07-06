import { _log } from '@fab/cli'
import execa from 'execa'
import path from 'path'

const log = _log('Typecheck')

export class Typecheck {
  static startTypecheck(config_path: string, plugins: string[], skip_typecheck: boolean) {
    if (skip_typecheck) {
      log(`🖤Skipping.🖤`)
      return Typecheck.Noop
    }

    const ts_plugins = plugins.filter((str) => str.match(/\.tsx?$/))
    if (plugins.length === 0) {
      log(`🖤No Typescript plugins detected. Skipping.🖤`)
      return Typecheck.Noop
    }

    return new Typecheck(path.dirname(config_path), ts_plugins)
  }

  promise: Promise<any> | undefined

  constructor(cwd: string, plugins: string[]) {
    log(`Typechecking ${plugins.length} plugins (in background)...`)
    this.promise = execa('tsc', ['--pretty', '--noEmit', ...plugins], { cwd })
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
