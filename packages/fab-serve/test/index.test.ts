import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('@fab/serve', () => {
  test
    .stderr()
    .command(['fab-static'])
    .exit(2)
    .it('runs without arguments', ctx => {
      // Not sure if this is even running tbh
      // expect(ctx.stderr).to.contain('You must provide a FAB file to run')
    })

  test
    .stdout()
    .do(() => cmd.run(['build.xyz1234.fab']))
    .it('runs with no port specified', ctx => {
      expect(ctx.stdout).to.contain('Serving build.xyz1234.fab on http://localhost:3000')
    })

  test
    .stdout()
    .env({PORT: '3001'})
    .do(() => cmd.run(['build.xyz1234.fab']))
    .it('should pull PORT from the environment', ctx => {
      expect(ctx.stdout).to.contain('Serving build.xyz1234.fab on http://localhost:3001')
    })

  test
    .stdout()
    .env({PORT: '3001'})
    .do(() => cmd.run(['build.xyz1234.fab', '--port', '3002']))
    .it('should use --port if provided', ctx => {
      expect(ctx.stdout).to.contain('Serving build.xyz1234.fab on http://localhost:3002')
    })
})
