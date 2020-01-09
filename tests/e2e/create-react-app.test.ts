import * as tmp from 'tmp-promise'
import * as fs from 'fs-extra'
import { shell, cmd } from '../utils'

it('should allow creation of a tmp dir', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  await shell(`ls -l ${dir.path}`)
  const { stdout } = await cmd(`pwd`, { cwd: dir.path })
  expect(stdout).toMatch('tmp')
})

it('should allow creation of a new CRA project into a FAB', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  await shell(`ls -l ${dir.path}`)
  await shell(`yarn create react-app cra-test`, { cwd: dir.path })
  const cwd = `${dir.path}/cra-test`
  const { stdout: files } = await cmd(`ls -l ${cwd}`)
  expect(files).toMatch('package.json')

  await fs.writeFile(`${cwd}/.env`, `SKIP_PREFLIGHT_CHECK=true`)
  await shell(`cat .env`, { cwd })
  await shell(`fab init -y --skip-install --version=next`, { cwd })
  await shell(`yarn build:fab`, { cwd })

  const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
  expect(files_after_fab_build).toMatch('fab.zip')

  // await shell(`yarn add npm-run-all @fab/serve`)
  const package_json = JSON.parse(await fs.readFile(`${cwd}/package.json`, 'utf8'))
  package_json.scripts = {
    ...package_json.scripts,
    'test:fab': 'run-p --race "test:fab:*"',
    'test:fab:serve': 'fab serve fab.zip',
    'test:fab:test-local': 'sleep 1 && curl -v http://localhost:3000',
  }
})
