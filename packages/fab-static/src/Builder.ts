import * as path from 'path'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import chalk from 'chalk'
import { error, log, note } from './log'
import HtmlCompiler from './HtmlCompiler'
import Compiler from '@fab/compile/lib/Compiler'
import * as hasha from 'hasha'
import * as prettier from 'prettier'

interface Config {
  directory: string
  output: string
  working_dir: string
  server: string | undefined
}

export default class Builder {
  static async start(config: Config, intermediate_only: boolean) {
    const { directory: dir, output, working_dir, server } = config

    const abs_dir = path.resolve(dir)
    const abs_working_dir = path.resolve(working_dir)
    const abs_int_dir = path.join(abs_working_dir, 'intermediate')

    console.log({ config })

    log(`Compiling ${chalk.green(abs_dir)}`)

    if (!(await fs.pathExists(abs_dir))) {
      error(`Error: ${abs_dir} doesn't exist!`)
      throw new Error(`Directory doesn't exist`)
    }

    await fs.emptyDir(abs_working_dir)
    await fs.ensureDir(abs_int_dir)

    if (await fs.pathExists(path.join(abs_dir, '_server'))) {
      error(`Warning: ${path.join(dir, '_server')} directory detected.
             fab-static will ignore this, and inject its own.
             Perhaps you want @fab/compile instead?`)
    }

    const htmls = await globby(['**/*.html', '!_server/**/*'], {
      cwd: abs_dir
    })

    const htmls_dir = path.join(working_dir, 'intermediate', '_server', 'htmls')
    const html_rewrites: { [path: string]: string } = {}
    if (htmls.length > 0) {
      log(`Compiling HTML into templates:`)
      await fs.ensureDir(path.resolve(htmls_dir))

      for (const html of htmls) {
        const compiled = await HtmlCompiler.compile(path.join(abs_dir, html))

        const full_hash = hasha(compiled, { algorithm: 'md5' })
        const hash = full_hash!.substring(0, 9)

        const filename = `${path.basename(html, '.html')}.${hash}.mustache.html`
        log(
          `  ${chalk.gray(dir + '/')}${chalk.yellow(html)} => ${chalk.gray(
            htmls_dir + '/'
          )}${chalk.yellow(filename)}`
        )
        await fs.writeFile(path.resolve(path.join(htmls_dir, filename)), compiled)
        html_rewrites[html] = filename
      }
    } else {
      error(
        `Warning: no HTML files found in ${dir}. Are you sure you're compiling the right directory?`
      )
    }

    log(`Writing HTML rewrite manifest`)
    const manifest = prettier.format(
      `module.exports = { 
      ${Object.keys(html_rewrites)
        .map(html_path => `"/${html_path}": require('./${html_rewrites[html_path]}'),`)
        .join()}
    }`,
      // @ts-ignore (babylon has been renamed, but not in @types)
      { parser: 'babel' }
    )
    await fs.writeFile(path.resolve(path.join(htmls_dir, 'index.js')), manifest)
    log(`  Wrote ${chalk.gray(htmls_dir + '/')}${chalk.yellow('index.js')}`)

    const non_htmls = await globby(['**/*', '!**/*.html', '!_server/**/*'], {
      cwd: abs_dir
    })

    if (non_htmls.length > 0) {
      log(`Copying non-HTML files`)
      const new_dirs = new Set()
      for (const filename of non_htmls) {
        const dirname = path.dirname(filename)
        if (dirname !== '.' && !new_dirs.has(dirname))
          await fs.ensureDir(path.join(abs_int_dir, dirname))
        new_dirs.add(dirname)

        log(
          `  ${chalk.gray(dir + '/')}${chalk.yellow(filename)} => ${chalk.gray(
            working_dir + '/intermediate/'
          )}${chalk.yellow(filename)}`
        )
        await fs.copy(path.join(abs_dir, filename), path.join(abs_int_dir, filename))
      }
    } else {
      note(`Note: no non-HTML files found in ${dir}.`)
    }

    log(`Copying server files.`)
    log(
      `  ${chalk.gray('@fab/static/')}${chalk.yellow('files/fab-wrapper.js')} => ${chalk.gray(
        working_dir + '/intermediate/_server/'
      )}${chalk.yellow('index.js')}`
    )
    await fs.copy(
      path.resolve(__dirname, 'files/fab-wrapper.js'),
      path.join(abs_int_dir, '_server', 'index.js')
    )

    log(
      `  ${chalk.gray('@fab/static/')}${chalk.yellow(
        'files/default-app-server.js'
      )} => ${chalk.gray(working_dir + '/intermediate/_server/')}${chalk.yellow(
        'default-app-server.js'
      )}`
    )
    await fs.copy(
      path.resolve(__dirname, 'files/default-app-server.js'),
      path.join(abs_int_dir, '_server', 'default-app-server.js')
    )

    const app_server_path = path.join(abs_int_dir, '_server', 'app-server.js');
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

    const build_path = path.join(abs_working_dir, 'build')
    console.log('ABOUT TO BUILD')
    await Compiler.compile(abs_int_dir, build_path, path.resolve(output), {
      module_loaders: [{
        test: /\.html$/,
        loader: 'mustache-loader'
      }],
      resolve_loader_modules: ['node_modules/@fab/static/node_modules'],
      resolve_aliases: {
        'app-server': server ? app_server_path : './default-app-server.js'
      }
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
