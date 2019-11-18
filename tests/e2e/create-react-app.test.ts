import * as execa from 'execa'
import * as tmp from 'tmp-promise'

it('should have our packages locally', async () => {
  const dir = await tmp.dir()
  console.log({dir})
  await execa.command(`cd ${dir.path}`)
  const { stdout } = await execa.command(`pwd`)
  console.log({stdout})
  expect(stdout).toMatch(/tmp/)
})
