import { InputStaticArgs, InputStaticMetadata } from './types'
import { ProtoFab, FabBuildStep } from '@fab/core'
import fs from 'fs-extra'
import globby from 'globby'
import path from 'path'
import { InvalidConfigError, relativeToConfig } from '@fab/cli'
import { log } from '@fab/cli/src'

export const build: FabBuildStep<InputStaticArgs, InputStaticMetadata> = async (
  args,
  proto_fab,
  config_path
) => {
  const dir = relativeToConfig(config_path, args.dir)

  if (!dir) {
    throw new InvalidConfigError(`@fab/input-static requires an argument of 'dir'.`)
  }
  if (!(await fs.pathExists(dir))) {
    throw new InvalidConfigError(
      `@fab/input-static specifies a 'dir' of '${dir}', which doesn't exist.`
    )
  }
  if (proto_fab.files!.size > 0) {
    throw new InvalidConfigError(
      `@fab/input-static must be the first 'input' plugin in the chain.`
    )
  }

  console.log(`I am input static! Reading files from ${dir}`)
  const files = await globby([`**/*`], { cwd: dir })

  console.log(`Reading their contents`)

  await Promise.all(
    files.map(async (filename) => {
      proto_fab.files!.set('/' + filename, await fs.readFile(filename, 'utf8'))
    })
  )
}
