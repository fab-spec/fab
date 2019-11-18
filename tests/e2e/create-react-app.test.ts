import * as execa from 'execa'
import * as tmp from 'tmp-promise'

it('should allow creation of a tmp dir', async () => {
  const dir = await tmp.dir({dir: process.env.GITHUB_WORKSPACE})
  console.log({dir})
  await execa.command(`cd ${dir.path}`)
  const { stdout } = await execa.command(`pwd`)
  console.log({stdout})
  expect(stdout).toMatch(/tmp/)
})
