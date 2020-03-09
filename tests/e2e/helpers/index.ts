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
  const cwd = path.join(workspace_dir, dirname)
  console.log({ working_dir: cwd })

  if (clean && (await fs.pathExists(cwd))) {
    await fs.remove(cwd)
  }

  await fs.ensureDir(cwd)
  await shell(`git init`, { cwd })
  return cwd
}
