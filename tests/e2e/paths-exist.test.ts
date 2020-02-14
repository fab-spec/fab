import * as execa from 'execa'

it('should have our packages installed', async () => {
  if (!process.env.PUBLIC_PACKAGES) {
    const { stdout: bins } = await execa.command(`ls -l ../node_modules/.bin/fab`)
    expect(bins).toMatch(/\/fab/)
  }

  const { stdout } = await execa.command(`which fab`)
  expect(stdout).toMatch(/\/fab/)
})
