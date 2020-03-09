import { cmd, shell } from '../../utils'
import fs from 'fs-extra'
import path from 'path'

let next_port = 3310
export const getPort = () => next_port++

export const buildFab = async (cwd: string, global = false) => {
  await shell(`rm -f fab.zip`, { cwd })
  await shell(global ? `fab build` : `yarn fab:build`, { cwd })

  const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
  expect(files_after_fab_build).toMatch('fab.zip')
}

const workspace_dir = path.resolve(__dirname, '../workspace')
console.log({ workspace_dir })
export const getWorkingDir = async (dirname: string, clean: boolean) => {
  const working_dir = path.join(workspace_dir, dirname)
  console.log({ working_dir })

  if (clean && (await fs.pathExists(working_dir))) {
    await fs.remove(working_dir)
  }

  await fs.ensureDir(working_dir)
  await shell(`git init`, { working_dir })
  return working_dir
}
