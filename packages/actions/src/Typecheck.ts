import { _log } from '@fab/cli'
import execa from 'execa'

const log = _log('Typecheck')

export class Typecheck {
  static startTypecheck(plugins: string[], skip_typecheck: boolean) {
    return new Typecheck(
      plugins.filter((str) => str.match(/\.tsx?$/)),
      skip_typecheck
    )
  }

  promise: Promise<any> | undefined
  skipped: boolean

  constructor(plugins: string[], skip_typecheck: boolean) {
    if (plugins.length === 0) {
      log(`🖤No Typescript plugins detected. Skipping.🖤`)
      this.skipped = true
    } else if (skip_typecheck) {
      log(`🖤Skipping.🖤`)
      this.skipped = true
    } else {
      log(`Typechecking ${plugins.length} plugins (in background)...`)
      this.promise = execa('tsc', ['--pretty', '--noEmit', ...plugins])
      this.skipped = false
    }
  }

  async waitForResults() {
    if (this.skipped) return

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
          `Treating errors as ❤️warnings❤️, set environment variable CI=true to fail the build on type errors.`
        )
      }
    }
  }
}
