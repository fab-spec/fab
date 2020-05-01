import { cmd, shell } from '../../utils'
import fs from 'fs-extra'
import path from 'path'

export const CRA_PORTS = 10100
export const NEXTJS_PORTS = 10200

export const getPorts = (first_port: number) => {
  let next_port = first_port
  return () => next_port++
}

export const buildFab = async (cwd: string, global = false) => {
  await shell(`rm -f fab.zip`, { cwd })
  await shell(global ? `npx fab build` : `yarn fab:build`, { cwd })

  const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
  expect(files_after_fab_build).toMatch('fab.zip')
}

const workspace_dir = path.resolve(__dirname, '../workspace')
export const getWorkingDir = async (dirname: string, clean: boolean) => {
  const cwd = path.join(workspace_dir, dirname)

  if (clean && (await fs.pathExists(cwd))) {
    await fs.remove(cwd)
  }

  await fs.ensureDir(cwd)
  return cwd
}
