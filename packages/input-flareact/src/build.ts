import { FabBuildStep } from '@fab/core'
import { InputFlareactMetadata, InputFlareactArgs } from './types'
import fs from 'fs-extra'
import { relativeToConfig } from '@fab/cli'

export const build: FabBuildStep<InputFlareactArgs, InputFlareactMetadata> = async (
  args,
  proto_fab,
  config_path,
  skip_cache = false
) => {
  /* NO IDEA IF THESE MAKE SENSE TO BE CONFIGURABLE JUST AN EXAMPLE */

  const { static_dir = '_out', worker_path = 'worker/script.js' } = args

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

  /* IF YOU NEED TO CHANGE SERVER.JS AT ALL YOU CAN DO IT HERE */
  proto_fab.hypotheticals[`FLAREACT_RENDERER.js`] = await fs.readFile(
    abs_worker_path,
    'utf8'
  )
}
