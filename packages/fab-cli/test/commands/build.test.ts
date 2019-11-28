import {expect, test} from '@oclif/test'
import { build } from '@fab/rewire-assets'

describe('build', () => {
  test
    .stdout()
    .command(['build'])
    .catch(err => expect(err.message).to.equal(`Missing config file at 'fab.config.json5'`))
    .it(`should report that it can't find the default config file`, ctx => {
      expect(ctx.stdout).to.contain('All FAB tooling assumes that you have a valid config file')
      expect(ctx.stdout).to.contain('use the --config argument')
      expect(ctx.stdout).to.contain('fab init')
    })

  test
    .stdout()
    .command(['build', '--config', 'no-existo.json5'])
    .catch(err => expect(err.message).to.equal(`Missing config file at 'no-existo.json5'`))
    .it('should report that the specified config file is missing', ctx => {
      expect(ctx.stdout).to.contain(`Config file 'no-existo.json5' not found.`)
      expect(ctx.stdout).to.contain('fab init')
    })
})
