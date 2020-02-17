import fs from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import { BuildFailedError } from '@fab/cli'

export async function preflightChecks(
  dir: string
): Promise<{
  next_dir_name: string
  next_dir: string
  asset_prefix: string
}> {
  const next_config_path = `${dir}/next.config.js`
  if (!(await fs.pathExists(next_config_path))) {
    throw new BuildFailedError(`next.config.js doesn't exist!
      You must have a ${chalk.yellow(
        'next.config.js'
      )} file in order to specify ${chalk.yellow(`target: 'serverless'`)}
    `)
  }

  const next_config_at_path = require(next_config_path)

  const next_config =
    typeof next_config_at_path === 'function'
      ? next_config_at_path('', {})
      : next_config_at_path

  if (next_config.target !== 'serverless') {
    throw new BuildFailedError(`Not serverless build
      NextJS project needs to be set to ${chalk.yellow('target: serverless')}
      You'll need to update your ${chalk.yellow('next.config.js')} file.
    `) // Add a documentation page for this info and link it here.
  }

  const notBuilt = (reason: string) => {
    throw new BuildFailedError(`${reason}
      The path may be incorrect, or you haven't run 'npm run build' on this project yet.
    `)
  }
  const next_dir_name = next_config.distDir || '.next'
  const next_dir = path.join(dir, next_dir_name)
  if (!(await fs.pathExists(next_dir))) {
    notBuilt(
      `Directory ${chalk.yellow(path.relative(process.cwd(), next_dir))} doesn't exist!`
    )
  }

  const manifest_path = path.join(next_dir, 'build-manifest.json')
  if (!(await fs.pathExists(manifest_path))) {
    notBuilt(
      `Missing build manifest in ${chalk.yellow(
        path.relative(process.cwd(), manifest_path)
      )}`
    )
  }

  const asset_prefix = next_config.assetPrefix || ''

  return { next_dir_name, next_dir, asset_prefix }
}
