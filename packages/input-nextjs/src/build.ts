import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { ProtoFab } from '@fab/core'
import fs from 'fs-extra'
import globby from 'globby'
import path from 'path'
import { InvalidConfigError } from '@fab/cli'

export async function build(
  args: InputNextJSArgs,
  proto_fab: ProtoFab<InputNextJSMetadata>
) {
  const { dir } = args

  if (!dir) {
    throw new InvalidConfigError(`@fab/input-nextjs requires an argument of 'dir'.`)
  }
  // if (!(await fs.pathExists(dir))) {
  //   throw new InvalidConfigError(
  //     `@fab/input-nextjs specifies a 'dir' of '${dir}', which doesn't exist.`
  //   )
  // }
  // if (proto_fab.files!.size > 0) {
  //   throw new InvalidConfigError(
  //     `@fab/input-nextjs must be the first 'input' plugin in the chain.`
  //   )
  // }
  //
  // console.log(`I am input static! Reading files from ${dir}`)
  //
  // const files = await globby([path.join(dir, '**', '*')])
  //
  // console.log(`Reading their contents`)
  //
  // await Promise.all(
  //   files.map(async (filename) => {
  //     proto_fab.files!.set(
  //       '/' + path.relative(dir, filename),
  //       await fs.readFile(filename, 'utf8')
  //     )
  //   })
  // )
}
