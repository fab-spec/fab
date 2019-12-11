import { InvalidConfigError, ProtoFab } from '@fab/core'
import globby from 'globby'
import path from 'path'
import fs from 'fs-extra'
import { InputStaticArgs, InputStaticMetadata } from './types'

export async function build(
  args: InputStaticArgs,
  proto_fab: ProtoFab<InputStaticMetadata>
) {
  const { dir } = args

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

  const files = await globby([path.join(dir, '**', '*')])

  console.log(`Reading their contents`)

  await Promise.all(
    files.map(async (filename) => {
      proto_fab.files!.set(
        path.relative(dir, filename),
        await fs.readFile(filename, 'utf8')
      )
    })
  )
}
