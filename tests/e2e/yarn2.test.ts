import path from 'path'
import { getWorkingDir } from './helpers'
import fs from 'fs-extra'
import { cmd, _shell } from '../utils'

describe('Yarn 2 tests', () => {
  let cwd: string
  let cwd_shell: ReturnType<typeof _shell>

  beforeAll(async () => {
    cwd = await getWorkingDir('yarn2', true)
    cwd_shell = _shell(cwd)
  })

  it('should create a very simple static site', async () => {
    if (!process.env.PUBLIC_PACKAGES) {
      throw new Error(`Haven't figured out how to locally test Yarn2 just yet`)
    }
    const src_dir = path.join(cwd, 'src')
    await fs.ensureDir(src_dir)
    await fs.ensureDir(path.join(cwd, 'dist'))
    await fs.writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({
        scripts: {
          build: 'rm -rf dist && cp -R src dist',
        },
      })
    )
    await fs.writeFile(path.join(src_dir, 'index.html'), '<h1>HULLO</h1>')
    await cwd_shell(`yarn set version berry`)
    await cwd_shell(`yarn dlx fab init -y`)
    const { stdout: files_after_fab_init } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_init).toMatch('fab.config.json5')

    await cwd_shell(`yarn build:fab`)
    const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_build).toMatch('fab.zip')
  })
})
