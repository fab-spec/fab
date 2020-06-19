import chokidar, { WatchOptions } from 'chokidar'
import p from 'path'

export const watcher = async (
  dirs: string[] | undefined,
  fn: () => Promise<void>,
  options?: WatchOptions
) => {
  if (dirs && dirs.length > 0) {
    let building = false
    const invalidations: string[] = []

    const run_fn_once_at_a_time = async (message: string) => {
      if (building) return
      building = true
      // console.clear()
      console.log(message)
      console.log(Object.keys(require.cache).filter((x) => x.match(/plugin-node-compat/)))
      invalidations.forEach((path) => {
        console.log(`Invalidating ${path}`)
        delete require.cache[path]
      })
      console.log(Object.keys(require.cache).filter((x) => x.match(/plugin-node-compat/)))
      invalidations.length = 0
      await fn()
      building = false
    }

    // noinspection ES6MissingAwait
    run_fn_once_at_a_time(`Watching paths: ${dirs.join(' ')}`)

    chokidar.watch(dirs).on('ready', () => {
      chokidar.watch(dirs, options).on('all', (event, path) => {
        console.log({ event, path })
        if (event === 'change') {
          console.log('trying to resolve')
          try {
            const resolved_path = p.resolve(path)
            console.log({ resolved_path })
            invalidations.push(resolved_path)
          } catch (e) {
            // noop
          }
        }
        run_fn_once_at_a_time(`${path} changed`)
      })
    })
  } else {
    await fn()
  }
}
