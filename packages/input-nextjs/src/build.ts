import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { ProtoFab, FabBuildStep } from '@fab/core'
import path from 'path'
import { InvalidConfigError } from '@fab/cli'
import { preflightChecks } from './utils'

export const build: FabBuildStep<InputNextJSArgs, InputNextJSMetadata> = async (
  args,
  proto_fab,
  config_path
) => {
  // const { dir } = args

  if (proto_fab.files!.size > 0) {
    throw new InvalidConfigError(
      `@fab/input-nextjs must be the first 'input' plugin in the chain.`
    )
  }

  const { next_dir_name, next_dir, asset_prefix } = await preflightChecks(
    path.dirname(path.resolve(config_path))
  )
  console.log({ next_dir_name, next_dir, asset_prefix })

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
