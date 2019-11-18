import * as execa from 'execa'
import * as tmp from 'tmp-promise'
import * as fs from 'fs-extra'

const cmd = (command: string, ...opts: any) => {
  process.stdout.write(`$ ${command}\n`)
  return execa.command(command, ...opts)
}
const shell = async (command: string, ...opts: any) => {
  const promise = cmd(command, ...opts)
  promise.stdout.pipe(process.stdout)
  promise.stderr.pipe(process.stderr)
  return promise
}

it('should allow creation of a tmp dir', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  await shell(`ls -l ${dir.path}`)
  const { stdout } = await cmd(`pwd`, { cwd: dir.path })
  console.log({ stdout })
  expect(stdout).toMatch('tmp')
})


it('should allow creation of a new CRA project', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  await shell(`ls -l ${dir.path}`)
  await shell(`yarn create react-app cra-test`, { cwd: dir.path })
  const cwd = `${dir.path}/cra-test`;
  const { stdout: files } = await cmd(`ls -l ${cwd}`)
  expect(files).toMatch('package.json')

  await fs.writeFile(`${cwd}/.env`, `SKIP_PREFLIGHT_CHECK=true`)
  await shell(`cat .env`, {cwd})
  await shell(`yarn build`, {cwd})
  await shell(`fab-static build`, {cwd})

  const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
  expect(files_after_fab_build).toMatch('fab.zip')
})
