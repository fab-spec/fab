import * as fs from 'fs-extra'
import * as path from 'path'
import * as util from 'util'
import * as globby from 'globby'
import Compiler from '@fab/compile/lib/Compiler'
import chalk from 'chalk'
import generateIncludes from './generateIncludes'
import rewriteWebpackEmptyContext from './rewriteWebpackEmptyContext'
import generateNextCache from './generateNextCache'

const _log = (str: string) =>
  `${chalk.gray(`[FAB:NextJS]`)} ${str.split(/\n\s*/).join('\n             ')}`
const log = (str: string) => console.log(_log(str))
const error = (str: string) => console.log(_log(chalk.red(str)))

export default class Builder {
  static async start(
    dir: string,
    working_dir: string,
    output_file: string,
    intermediate_only: boolean
  ) {
    let next_dir_name = '.next';
    const next_config = `${dir}/next.config.js`;
    if (await fs.pathExists(next_config)) {
      next_dir_name = require(next_config).distDir || next_dir_name;
    }
    next_dir = path.join(dir, next_dir_name);
    if (!(await fs.pathExists(dir))) {
      error(`${dir} doesn't exist!`)
      throw new Error('Missing directory')
    }
    if (!(await fs.pathExists(next_dir))) {
      error(`${next_dir} doesn't exist!`)
      throw new Error('Missing directory')
    }

    log(`Building ${chalk.green(dir)}`)
    const assets_path = path.join(next_dir, 'build-manifest.json')

    if (!(await fs.pathExists(assets_path))) {
      error(`Missing build manifest in ${assets_path}.`)
      log(
        `The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

      throw new Error('Missing .next/build-manifest.json')
    }

    await fs.emptyDir(working_dir)
    const int_dir = path.join(working_dir, 'intermediate')
    await fs.ensureDir(path.join(int_dir, '_assets'))
    await fs.ensureDir(path.join(int_dir, '_server'))

    log(`Copying .next/static to .fab/intermediate/_next/static`)
    await fs.copy(path.join(next_dir, 'static'), path.join(int_dir, '_next', 'static'))

    log(`Generating includes for the server files`)
    await generateIncludes(dir, path.join(int_dir, '_server'), next_dir_name)

    log(`Generating NEXT_CACHE for intercepting dynamic require() calls`)
    await generateNextCache(dir, path.join(int_dir, '_server'), next_dir_name)

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
      post_webpack_side_effect: async () => {
        log(`Injecting NEXT_CACHE lookups whenever dynamic require() calls are detected`)
        await rewriteWebpackEmptyContext(path.join(build_path, 'server.js'))
      }
    })
  }
}
