import * as fs from 'fs-extra'
import * as path from 'path'
import * as globby from 'globby'
import Compiler from '@fab/compile/lib/Compiler'

export default class Builder {
  static async start(
    dir: string,
    working_dir: string,
    output_file: string,
    intermediate_only: boolean
  ) {
    console.log(`Building in ${dir}`)

    const assets_path = path.join(dir, 'build', 'assets.json')
    const assets_str = await fs.readFile(assets_path, 'utf8')
    if (!assets_str)
      throw new Error(
        `Missing asset manifest in ${assets_path}. The path may be incorrect, or you haven't run 'npm run build' on this project yet.`
      )

    await fs.emptyDir(working_dir)
    const int_dir = path.join(working_dir, 'intermediate')
    await fs.ensureDir(path.join(int_dir, '_assets'))
    await fs.ensureDir(path.join(int_dir, '_server'))

    console.log(
      `Copying build/public/static to .fab/intermediate/_assets/static`
    )
    await fs.copy(
      path.join(dir, 'build', 'public', 'static'),
      path.join(int_dir, '_assets', 'static')
    )

    console.log(`Copying build/server.js to .fab/intermediate/_server/app.js`)
    await fs.copy(
      path.join(dir, 'build', 'server.js'),
      path.join(int_dir, '_server', 'app.js')
    )

    console.log(`Copying fab-wrapper from @fab/afterjs to .fab/intermediate/_server/index.js`)
    await fs.copy(
      path.join(__dirname, 'files', 'fab-wrapper.js'),
      path.join(int_dir, '_server', 'index.js')
    )

    console.log(`Copying mock-express-response from @fab/afterjs to .fab/intermediate/_server`)
    await fs.copy(
      path.join(__dirname, 'files', 'mock-express-response'),
      path.join(int_dir, '_server', 'mock-express-response')
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

    await Compiler.compile(int_dir, path.join(working_dir, 'build'), output_file)
  }
}
