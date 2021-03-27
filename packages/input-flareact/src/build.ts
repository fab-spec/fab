import { FabBuildStep } from '@fab/core'
import { InputFlareactMetadata, InputFlareactArgs } from './types'
import path from 'path'
import { relativeToConfig } from '@fab/cli'
import webpack from 'webpack'

export const build: FabBuildStep<InputFlareactArgs, InputFlareactMetadata> = async (
  args,
  proto_fab,
  config_path,
  skip_cache = false
) => {
  /* NO IDEA IF THESE MAKE SENSE TO BE CONFIGURABLE JUST AN EXAMPLE */
  const config_dir = path.dirname(path.resolve(config_path))
  const webpack_worker_config_file_path = path.join(
    config_dir,
    'node_modules/flareact/webpack'
  )
  const get_webpack_config = require(webpack_worker_config_file_path)
  const webpack_config = get_webpack_config()

  await new Promise((resolve, reject) =>
    webpack(webpack_config, (err, stats) => {
      if (err || stats?.hasErrors()) {
        console.log('Build failed.')
        console.log(err)
        console.log(stats && stats?.toJson()?.errors?.toString())
        reject()
      }
      resolve(null)
    })
  )
  const { static_dir = '_out', worker_path = 'dist/main.js' } = args

  const abs_static_dir = relativeToConfig(config_path, static_dir, false)
  const abs_worker_path = relativeToConfig(config_path, worker_path, false)

  /* CHECK EXISTENCE OF FILES AS SPECIFIED */

  /* LOAD STATIC ASSETS INTO proto_fab.files (see input-static/build) */

  // EG
  //
  //  log(`Reading files from ${dir}:`)
  //   const files = await globby([`**/*`], { cwd: abs_dir })
  //
  //   log(`Reading their contents`)
  //
  //   await Promise.all(
  //     files.map(async (filename) => {
  //       proto_fab.files!.set(
  //         '/' + filename,
  //         await fs.readFile(path.join(abs_dir, filename))
  //       )
  //     })
  //   )

  /* OK SO WORKER PATH ISN'T HERE, LET'S USE RUNTIME INSTEAD */
}
