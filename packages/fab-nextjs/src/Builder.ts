import * as fs from 'fs-extra'
import * as path from 'path'
import Compiler from '@fab/compile/lib/Compiler'
import chalk from 'chalk'
import generateIncludes from './generateIncludes'
import rewriteWebpackEmptyContext from './rewriteWebpackEmptyContext'
import generateNextCache from './generateNextCache'
import { error, log } from './utils'

export default class Builder {
  static async start(
    dir: string,
    working_dir: string,
    output_file: string,
    intermediate_only: boolean
  ) {
    const { next_dir_name, next_dir } = await this.preflightChecks(dir)

    log(`Building ${chalk.green(dir)}`)

    await fs.emptyDir(working_dir)
    const int_dir = path.join(working_dir, 'intermediate')
    await fs.ensureDir(path.join(int_dir, '_assets'))
    await fs.ensureDir(path.join(int_dir, '_server'))

    log(`Copying .next/static to .fab/intermediate/_next/static`)
    await fs.copy(
      path.join(next_dir, 'static'),
      path.join(int_dir, '_next', 'static')
    )

    log(`Copying .next/serverless/pages to .fab/intermediate/_server/pages`)
    await fs.copy(
      path.join(next_dir, 'serverless', 'pages'),
      path.join(int_dir, '_server', 'pages')
    )

    log(`Generating includes for the server files`)
    await generateIncludes(dir, path.join(int_dir, '_server'), next_dir_name)

    console.log(
      `Copying server.js from @fab/nextjs to .fab/intermediate/_server/index.js`
    )
    await fs.copy(
      path.join(__dirname, 'files', 'server.js'),
      path.join(int_dir, '_server', 'index.js')
    )

    console.log(
      `Copying mock-express-response from @fab/nextjs to .fab/intermediate/_server`
    )
    await fs.copy(
      path.join(__dirname, 'files', 'mock-express-response'),
      path.join(int_dir, '_server', 'mock-express-response')
    )

    if (intermediate_only) return log(`--intermediate-only set. Stopping here.`)

    const build_path = path.join(working_dir, 'build')
    console.log('ABOUT TO BUILD')
    await Compiler.compile(int_dir, build_path, output_file, {
      resolve_aliases: {
        fs: 'memfs',
      }
    })
  }

  private static async preflightChecks(dir: string): {
    next_dir_name: string,
    next_dir: string
  } {
    const next_config_path = `${dir}/next.config.js`
    if (!(await fs.pathExists(next_config_path))) {
      error(`next.config.js doesn't exist!`)
      log(
        `You must have a ${chalk.yellow(
          'next.config.js'
        )} file in order to specify ${chalk.yellow(`target: 'serverless'`)}`
      )
      throw new Error('Missing config file')
    }

    const next_config = require(next_config_path)
    if (next_config.target !== 'serverless') {
      error(`NextJS project needs to be set to target: serverless`)
      throw new Error('Not serverless build')
    }

    const next_dir_name = next_config.distDir || '.next'
    const next_dir = path.join(dir, next_dir_name)
    if (!(await fs.pathExists(dir))) {
      error(`${dir} doesn't exist!`)
      throw new Error('Missing directory')
    }
    if (!(await fs.pathExists(next_dir))) {
      error(`${next_dir} doesn't exist!`)
      throw new Error('Missing directory')
    }
    const assets_path = path.join(next_dir, 'build-manifest.json')

    if (!(await fs.pathExists(assets_path))) {
      error(`Missing build manifest in ${assets_path}.`)
      log(
        `The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

      throw new Error('Missing .next/build-manifest.json')
    }
    return { next_dir_name, next_dir }
  }
}
