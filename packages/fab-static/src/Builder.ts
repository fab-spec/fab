import * as path from 'path'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import chalk from 'chalk'
import { error, log, good } from './log'
import Compiler from './Compiler'
import * as hasha from 'hasha'

interface Config {
  directory: string
  output: string
  working_dir: string
  server: string | undefined
}

export default class Builder {
  static async start(config: Config) {
    const { directory: dir, output, working_dir, server } = config

    const abs_dir = path.resolve(dir)
    const abs_working_dir = path.resolve(working_dir)

    console.log({ config })

    log(`Compiling ${chalk.green(abs_dir)}`)

    if (!(await fs.pathExists(abs_dir))) {
      error(`Error: ${abs_dir} doesn't exist!`)
      throw new Error(`Directory doesn't exist`)
    }

    await fs.emptyDir(abs_working_dir)
    await fs.ensureDir(path.join(abs_working_dir, 'intermediate'))

    if (await fs.pathExists(path.join(abs_dir, '_server'))) {
      error(`Warning: ${path.join(dir, '_server')} directory detected.
             fab-static will ignore this, and inject its own.
             Perhaps you want @fab/compile instead?`)
    }

    const htmls = await globby(['**/*.html', '!_server/**/*'], {
      cwd: abs_dir
    })

    if (htmls.length > 0) {
      log(`Compiling HTML into templates:`)
      const htmls_dir = path.join(working_dir, 'intermediate', 'htmls')
      await fs.ensureDir(path.resolve(htmls_dir))

      for (const html of htmls) {
        const compiled = await Compiler.compile(path.join(abs_dir, html))

        const full_hash = hasha(compiled, { algorithm: 'md5' })
        const hash = full_hash!.substring(0, 9)

        const filename = `${path.basename(html, '.html')}.${hash}.mustache.html`
        log(
          `  ${chalk.gray(dir + '/')}${chalk.yellow(html)} => ${chalk.gray(
            htmls_dir + '/'
          )}${chalk.yellow(filename)}`
        )
        await fs.writeFile(path.resolve(path.join(htmls_dir, filename)), compiled)
      }
    } else {
      error(
        `Warning: no HTML files found in ${dir}. Are you sure you're compiling the right directory?`
      )
    }

    const non_htmls = await globby(['**/*', '!**/*.html', '!_server/**/*'], {
      cwd: abs_dir
    })

    /*

    STATIC PART

    - loads all the HTML templates
    - compiles them into an intermediate format for runtime injection
    - generates server/htmls.js with them inlined (or 'required' and webpack will do it)
    - compiles them into server.js with a handler for injecting
      - Runtime variables
      - HTTP headers


    Output structure:

    - /_assets/*         (already fingerprinted, good to go)
    - /_server/index.js  (about to be wrapped & webpacked)
    - /_server/*         (any files referenced by index.js go here)
    - /*                 (all extra files get shunted around)

        - Move any non /_asset or server.js files into _assets
    - Fingerprint them
    - Record a manifest of /favicon.ico -> /_assets/favicon.a1b2c3d4.ico
    - Wrap server.js in a handler that checks the manifest and rewrites
      - The handler needs to specify cache headers

    */
  }
}
