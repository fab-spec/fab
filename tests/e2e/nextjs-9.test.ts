import * as tmp from 'tmp-promise'
import * as fs from 'fs-extra'
import { shell, cmd } from '../utils'

it('should allow creation of a new NextJS project into a FAB', async () => {
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
