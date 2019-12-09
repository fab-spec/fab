import * as execa from 'execa'
import * as tmp from 'tmp-promise'
import * as fs from 'fs-extra'

const cmd = (command: string, ...opts: any) => {
  process.stdout.write(`$ ${command}\n`)
  return execa.command(command, ...opts)
}
const shell = async (command: string, ...opts: any) => {
  const promise = cmd(command, ...opts)
  promise.stdout!.pipe(process.stdout)
  promise.stderr!.pipe(process.stderr)
  return promise
}
const SHOULD_HAVE_THROWN = `Shouldn't get here, expected to have already thrown`
const expectError = async (command: string, ...opts: any) => {
  try {
    await cmd(command, ...opts)
    throw SHOULD_HAVE_THROWN
  } catch (error) {
    if (error === SHOULD_HAVE_THROWN) throw new Error(error)
    return error
  }
}

it('should test a series of configs against a static dir', async () => {
  const tmp_dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  const cwd = `${tmp_dir.path}/static`
  await shell(`cp -R ${__dirname}/static ${cwd}`)

  const no_config = await expectError(`fab build`, { cwd })
  expect(no_config.stderr).toContain(`Error: Missing config file`)
  expect(no_config.stderr).toContain(`fab.config.json5`)
  expect(no_config.stdout).toContain(
    `All FAB tooling assumes that you have a valid config file`
  )
  expect(no_config.stdout).toContain(`fab.config.json5`)

  const empty_config = await expectError(`fab build -c fab.empty-config.json5`, { cwd })
  expect(empty_config.stderr).toContain(
    `Error: The FAB config file is missing a 'build' property.`
  )
  expect(empty_config.stdout).toContain(`Config file contains errors!`)

  const unknown_module = await expectError(`fab build -c fab.unknown-module.json5`, {
    cwd,
  })
  expect(unknown_module.stderr).toContain(`Cannot find module '@fab/no-existo'`)
  expect(unknown_module.stderr).toContain(`Are you sure it's installed?`)
  expect(unknown_module.stdout).toContain(`Config file contains errors!`)
})
