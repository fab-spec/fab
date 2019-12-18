import { expect, test } from '@oclif/test'

describe('build', () => {
  test
    .stdout()
    .command(['build'])
    .catch((err) =>
      expect(err.message).to.equal(`Missing config file at 'fab.config.json5'`)
    )
    .it(`should report that it can't find the default config file`, (ctx) => {
      expect(ctx.stdout).to.contain(
        'All FAB tooling assumes that you have a valid config file'
      )
      expect(ctx.stdout).to.contain('use the --config argument')
      expect(ctx.stdout).to.contain('fab init')
    })

  test
    .stdout()
    .command(['build', '--config', 'no-existo.json5'])
    .catch((err) =>
      expect(err.message).to.equal(`Missing config file at 'no-existo.json5'`)
    )
    .it('should report that the specified config file is missing', (ctx) => {
      expect(ctx.stdout).to.contain(`Config file 'no-existo.json5' not found.`)
      expect(ctx.stdout).to.contain('fab init')
    })

  const empty_config = `${__dirname}/fixtures/fab.empty-config.json5`
  test
    .stdout()
    .command(['build', '--config', empty_config])
    .catch((err) =>
      expect(err.message).to.equal(
        `Could not parse file at '${empty_config}'. Check that it is valid JSON5.`
      )
    )
    .it('should report that the specified config file is empty', (ctx) => {
      expect(ctx.stdout).to.contain('Config file contains errors!')
    })

  const unknown_module_config = `${__dirname}/fixtures/fab.unknown-module.json5`
  test
    .stdout()
    .command(['build', '--config', unknown_module_config])
    .catch((err) => expect(err.message).to.contain(`Cannot find module '@fab/no-existo'`))
    .it('should report that the module cannot be found', (ctx) => {
      expect(ctx.stdout).to.contain('Config file contains errors!')
    })

  const no_runtime_config = `${__dirname}/fixtures/fab.plugin-no-runtime.json5`
  test
    .stdout()
    .command(['build', '--config', no_runtime_config])
    .catch((err) =>
      expect(err.message).to.contain(`The plugin at './plugins/no-runtime' has errors!`)
    )
    .it('should check that the plugin has a runtime entry point', (ctx) => {
      expect(ctx.stdout).to.contain(
        `The plugin './plugins/no-runtime' has no 'runtime' export, but is referenced in the 'runtime' section of the config!`
      )
      expect(ctx.stdout).to.match(
        /Looked for .*\/plugins\/no-runtime\/runtime and .*\/plugins\/no-runtime/
      )
    })
})
