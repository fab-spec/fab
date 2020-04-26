import execa from 'execa'

if (!process.env.PUBLIC_PACKAGES) {
  it('should have our packages installed', async () => {
    const { stdout: bins } = await execa.command(`ls -l ../node_modules/.bin/fab`)
    expect(bins).toMatch(/\/fab/)

    const { stdout } = await execa.command(`which fab`)
    expect(stdout).toMatch(/\/fab/)
  })
} else {
  it('should NOT have our packages installed (since we are using npx)', async () => {
    const { stdout: bins } = await execa.command(`ls -l ../node_modules/.bin/fab`)
    expect(bins).not.toMatch(/\/fab/)

    const { stdout } = await execa.command(`which fab`)
    expect(stdout).not.toMatch(/\/fab/)
  })
}
