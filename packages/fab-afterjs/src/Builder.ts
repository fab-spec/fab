import * as fs from 'fs-extra'
import * as path from 'path'
import * as webpack from 'webpack'
import * as util from 'util'
import * as globby from 'globby'
// @ts-ignore
import * as _zip from 'deterministic-zip'
const zip = util.promisify(_zip)

export default class Builder {
  static async start(
    dir: string,
    output_dir: string,
    intermediate_only: boolean
  ) {
    console.log(`Building in ${dir}`)

    const assets_path = path.join(dir, 'build', 'assets.json')
    const assets_str = await fs.readFile(assets_path, 'utf8')
    if (!assets_str)
      throw new Error(
        `Missing asset manifest in ${assets_path}. The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

    // Can this just move (without compiling) files into place and let 'fab compile'
    // do the actual webpacking?

    const int_dir = path.join(output_dir, 'intermediate')
    await fs.emptyDir(int_dir)
    await fs.ensureDir(path.join(int_dir, '_assets'))
    await fs.ensureDir(path.join(int_dir, '_server'))

    console.log(
      `Copying build/public/static to .fab/intermediate/_assets/static`
    )
    await fs.copy(
      path.join(dir, 'build', 'public', 'static'),
      path.join(int_dir, '_assets', 'static')
    )

    console.log(`Copying build/server.js to .fab/intermediate/_server/index.js`)
    await fs.copy(
      path.join(dir, 'build', 'server.js'),
      path.join(int_dir, '_server', 'index.js')
    )

    console.log(`Copying remaining files to .fab/intermediate`)
    const paths = await globby(['**/*', '!public/static', '!server.js'], {
      cwd: path.join(dir, 'build')
    })
    await Promise.all(
      paths.map(async file => {
        console.log(`Copying ${file} to ${int_dir}/${file}`)
        await fs.copy(path.join(dir, 'build', file), path.join(int_dir, file))
      })
    )
    console.log(paths)

    if (intermediate_only)
      return console.log(`--intermediate-only set. Stopping here.`)


    await fs.copy(
      path.resolve(dir, 'build/public'),
      path.resolve(output_dir, '_assets')
    )

    const zipfile = path.resolve(output_dir, 'fab.zip')
    const options = {
      includes: ['./server/**', './_assets/**'],
      cwd: output_dir
    }
    await zip(output_dir, zipfile, options)
  }
}
