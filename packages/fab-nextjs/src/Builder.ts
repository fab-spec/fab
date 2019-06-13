import * as fs from 'fs-extra'
import * as path from 'path'
import Compiler from '@fab/compile/lib/Compiler'
import chalk from 'chalk'
import generateIncludes from './generateIncludes'
import { error, log } from './utils'

export default class Builder {
  static async start(
    dir: string,
    working_dir: string,
    output_file: string,
    server: string | undefined,
    intermediate_only: boolean
  ) {
    const { next_dir_name, next_dir, asset_prefix } = await this.preflightChecks(dir)

    log(`Building ${chalk.green(dir)}`)

    await fs.emptyDir(working_dir)
    const int_dir = path.join(working_dir, 'intermediate')
    await fs.ensureDir(path.join(int_dir, '_assets'))
    await fs.ensureDir(path.join(int_dir, '_server'))
    await fs.ensureDir(path.join(int_dir, 'static'))

    if (asset_prefix === '/_assets') {
      log(`Copying .next/static to .fab/intermediate/_assets/_next/static`)
      await fs.copy(
        path.join(next_dir, 'static'),
        path.join(int_dir, '_assets', '_next', 'static')
      )
    } else {
      if (asset_prefix !== '') {
        error(`assetPrefix of '${asset_prefix}' not supported! You must use '/_assets' or not specify one.`)
        throw new Error('Unsupported assetPrefix')
      }
      log(`Copying .next/static to .fab/intermediate/_next/static`)
      await fs.copy(
        path.join(next_dir, 'static'),
        path.join(int_dir, '_next', 'static')
      )
    }

    log(`Copying static files`)
    await fs.copy(path.join(dir, 'static'), path.join(int_dir, 'static'))

    log(`Generating includes for the server files`)
    await generateIncludes(dir, path.join(int_dir, '_server'), next_dir_name)

    log(
      `Copying server.js from @fab/nextjs to .fab/intermediate/_server/index.js`
    )
    await fs.copy(
      path.join(__dirname, 'files', 'server.js'),
      path.join(int_dir, '_server', 'index.js')
    )

    log(
      `Copying path-with-posix.js from @fab/nextjs to .fab/intermediate/_server/path-with-posix.js`
    )
    await fs.copy(
      path.join(__dirname, 'files', 'path-with-posix.js'),
      path.join(int_dir, '_server', 'path-with-posix.js')
    )

    log(
      `Copying default-app-server.js from @fab/nextjs to .fab/intermediate/_server/default-app-server.js`
    )
    await fs.copy(
      path.join(__dirname, 'files', 'default-app-server.js'),
      path.join(int_dir, '_server', 'default-app-server.js')
    )

    log(
      `Copying mock-express-response from @fab/nextjs to .fab/intermediate/_server`
    )
    await fs.copy(
      path.join(__dirname, 'files', 'mock-express-response'),
      path.join(int_dir, '_server', 'mock-express-response')
    )

    const app_server_path = path.join(int_dir, '_server', 'app-server.js')
    if (server) {
      const abs_server = path.resolve(server)
      if (!(await fs.pathExists(abs_server))) {
        error(`Error: The server ${abs_server} doesn't exist!`)
        throw new Error('Server file missing')
      }
      log(
        `  ${chalk.yellow(server)} => ${chalk.gray(
          working_dir + '/intermediate/_server/'
        )}${chalk.yellow('app-server.js')}`
      )
      await fs.copy(abs_server, app_server_path)
    }

    if (intermediate_only) return log(`--intermediate-only set. Stopping here.`)

    const build_path = path.join(working_dir, 'build')
    log('ABOUT TO BUILD')
    await Compiler.compile(int_dir, build_path, output_file, {
      resolve_aliases: {
        fs: 'memfs',
        path: path.resolve(path.join(int_dir, '_server', 'path-with-posix.js')),
        'app-server': server ? path.resolve(app_server_path) : './default-app-server.js'
      }
    })
  }

  private static async preflightChecks(
    dir: string
  ): Promise<{
    next_dir_name: string
    next_dir: string,
    asset_prefix: string
  }> {
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

    const asset_prefix = next_config.assetPrefix || ''

    return { next_dir_name, next_dir, asset_prefix }
  }
}
