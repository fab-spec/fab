import { InputNextJSArgs, InputNextJSMetadata } from './types'
import { ProtoFab, FabBuildStep } from '@fab/core'
import path from 'path'
import { InvalidConfigError, log } from '@fab/cli'
import { preflightChecks } from './preflightChecks'
import globby from 'globby'
import fs from 'fs-extra'
import generateIncludes from './generateIncludes'

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

  log(`I am Input NextJS! Reading files from ${next_dir}`)
  const pages_dir = path.join(next_dir, 'serverless', 'pages')

  log(`Finding all static HTML pages`)
  const html_files = await globby([`**/*.html`, `!_*`], { cwd: pages_dir })

  await Promise.all(
    html_files.map(async (filename) => {
      proto_fab.files!.set('/' + filename, await fs.readFile(filename, 'utf8'))
    })
  )

  log(`Finding all dynamic NextJS entry points`)
  const js_renderers = await globby([`**/*.js`, `!_*`], { cwd: pages_dir })
  const render_code = await generateIncludes(js_renderers, pages_dir)
}
