import * as execa from 'execa'

it('should pass a noop', () => {
  expect(1 + 1).toBe(2)
})

it('should have our packages locally', async () => {
  const { stdout: bins } = await execa.command(`ls -l ../node_modules/.bin/fab`)
  expect(bins).toMatch(/\/fab/)
})

it('should have our packages globally', async () => {
  const { stdout } = await execa.command(`which fab`)
  expect(stdout).toMatch(/\/fab/)
})
