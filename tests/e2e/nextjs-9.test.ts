import * as tmp from 'tmp-promise'
import * as fs from 'fs-extra'
import { shell, cmd } from '../utils'

/*
it.skip('should allow creation of a new NextJS project into a FAB', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  await shell(`ls -l ${dir.path}`)
  await shell(`yarn create next-app nextjs9-test`, { cwd: dir.path })
  const cwd = `${dir.path}/nextjs9-test`
  const { stdout: files } = await cmd(`ls -l ${cwd}`)
  expect(files).toMatch('package.json')

  await shell(`fab init -y --skip-install --version=next`, { cwd })
  await shell(`yarn build:fab`, { cwd })

  const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
  expect(files_after_fab_build).toMatch('fab.zip')
})
*/

let next_port = 3210
const getPort = () => next_port++

describe('Create React App E2E Test', () => {
  let tmpdir: string
  let cwd: string

  it('should allow creation of a new NextJS project in a tmp dir', async () => {
    if (process.env.FAB_E2E_NEXTJS_DIR) {
      cwd = process.env.FAB_E2E_NEXTJS_DIR
      if (!cwd.startsWith('/var/folders/' || !cwd.endsWith('/nextjs-test'))) {
        // The value of FAB_E2E_NEXTJS_DIR doesn't match the above, exiting.
        process.exit(1)
      }
      await shell(`git reset --hard`, { cwd })
      await shell(`git clean -df`, { cwd })
    } else {
      // Create the tmp dir (inside the workspace if on Github Actions)
      const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
      tmpdir = dir.path
      expect(tmpdir).toMatch('tmp')

      // Create a new NextJS project inside
      await shell(`yarn create next-app nextjs-test`, { cwd: tmpdir })
      cwd = `${tmpdir}/nextjs-test`
    }
    // Expect that {cwd} has a package.json
    const { stdout: files } = await cmd(`ls -l`, { cwd })
    expect(files).toMatch('package.json')
  })

  it('should configure the NextJS project to produce FABs', async () => {
    await shell(`fab init -y --skip-install --version=next`, { cwd })
    const { stdout: files_after_fab_init } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_init).toMatch('fab.config.json5')

    const package_json = JSON.parse(await fs.readFile(`${cwd}/package.json`, 'utf8'))
    package_json.scripts = {
      ...package_json.scripts,
      'fab:serve': 'fab serve fab.zip',
    }
    await fs.writeFile(`${cwd}/package.json`, JSON.stringify(package_json, null, 2))
    await shell(`yarn build:fab`, { cwd })

    const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_build).toMatch('fab.zip')
  })
})
