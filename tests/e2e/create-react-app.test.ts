import * as execa from 'execa'
import * as tmp from 'tmp-promise'

const cmd = (command: string, ...opts: any) => {
  console.log(command)
  return execa.command(command, ...opts)
}
const shell = async (command: string, ...opts: any) => {
  console.log((await cmd(command)).stdout)
}

it('should allow creation of a tmp dir', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  console.log({ dir })
  await shell(`ls -l ${dir.path}`)
  const { stdout } = await cmd(`pwd`, { cwd: dir.path })
  console.log({ stdout })
  expect(stdout).toMatch(/tmp/)
})


it('should allow creation of a new CRA project', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  await shell(`ls -l ${dir.path}`)
  await shell(`yarn create react-app .`, { cwd: dir.path })
  const { stdout: files } = await cmd(`ls -l ${dir.path}`)
  console.log(files)
  expect(files).toMatch(/package\.json/)
})
