import path from 'path'
import { getWorkingDir } from './helpers'
import fs from 'fs-extra'
import { cmd, _shell, shell } from '../utils'

describe('Server-side logic tests', () => {
  let cwd: string
  let cwd_shell: ReturnType<typeof _shell>

  beforeAll(async () => {
    cwd = await getWorkingDir('server-side-logic', true)
    cwd_shell = _shell(cwd)
  })

  it('should create a very simple static site', async () => {
    const src_dir = path.join(cwd, 'public')
    await fs.ensureDir(src_dir)
    await fs.writeFile(
      path.join(cwd, 'package.json'),
      JSON.stringify({
        scripts: {
          build: 'echo noop',
        },
      })
    )
    await fs.writeFile(path.join(src_dir, 'index.html'), '<h1>HULLO</h1>')

    await cwd_shell(
      process.env.PUBLIC_PACKAGES
        ? 'npx fab init -y --version=next'
        : 'fab init -y --skip-install'
    )
    const { stdout: files_after_fab_init } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_init).toMatch('fab.config.json5')

    await cwd_shell(`yarn build:fab`)
    const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_build).toMatch('fab.zip')
  })
})
