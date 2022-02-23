import { InputStaticArgs, InputStaticMetadata } from './types'
import { FabBuildStep } from '@dev-spendesk/core'
import fs from 'fs-extra'
import globby from 'globby'
import path from 'path'
import { InvalidConfigError, relativeToConfig } from '@dev-spendesk/fab-cli'
import { _log } from '@dev-spendesk/fab-cli'
const log = _log(`@dev-spendesk/input-static`)

export const build: FabBuildStep<InputStaticArgs, InputStaticMetadata> = async (
  args,
  proto_fab,
  config_path,
  skip_cache = false
) => {
  const { dir } = args

  if (!dir) {
    throw new InvalidConfigError(
      `@dev-spendesk/input-static requires an argument of 'dir'.`
    )
  }

  const abs_dir = relativeToConfig(config_path, dir, false)

  if (!(await fs.pathExists(abs_dir))) {
    throw new InvalidConfigError(
      `@dev-spendesk/input-static specifies a 'dir' of '${dir}', which doesn't exist.`
    )
  }
  if (proto_fab.files!.size > 0) {
    throw new InvalidConfigError(
      `@dev-spendesk/input-static must be the first 'input' plugin in the chain.`
    )
  }

  log(`Reading files from ${dir}:`)
  const files = await globby([`**/*`], { cwd: abs_dir })

  log(`Reading their contents`)

  await Promise.all(
    files.map(async (filename) => {
      proto_fab.files!.set(
        '/' + filename,
        await fs.readFile(path.join(abs_dir, filename))
      )
    })
  )
}
