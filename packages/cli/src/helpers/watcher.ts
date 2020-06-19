import chokidar, { WatchOptions } from 'chokidar'

export const watcher = async (
  dirs: string[] | undefined,
  fn: () => Promise<void>,
  options?: WatchOptions
) => {
  if (dirs && dirs.length > 0) {
    let building = false

    const run_fn_once_at_a_time = async (message: string) => {
      if (building) return
      building = true
      console.clear()
      console.log(message)
      await fn()
      building = false
    }

    // noinspection ES6MissingAwait
    run_fn_once_at_a_time(`Watching paths: ${dirs.join(' ')}`)

    chokidar.watch(dirs).on('ready', () => {
      chokidar.watch(dirs, options).on('all', (event, path) => {
        run_fn_once_at_a_time(`${path} changed`)
      })
    })
  } else {
    await fn()
  }
}
