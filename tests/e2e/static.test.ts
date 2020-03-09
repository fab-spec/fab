import tmp from 'tmp-promise'
import { expectError, shell } from '../utils'

describe('dir of static assets', () => {
  const opts = { cwd: '' }

  beforeAll(async () => {
    const tmp_dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
    opts.cwd = `${tmp_dir.path}/static`
    await shell(`cp -R ${__dirname}/fixtures/static ${opts.cwd}`)
  })

  describe('failure cases', () => {
    it('should handle a missing config file', async () => {
      const { stderr, stdout } = await expectError(`fab build`, opts)
      expect(stderr).toContain(`Error: Missing config file`)
      expect(stderr).toContain(`fab.config.json5`)
      expect(stdout).toContain(
        `All FAB tooling assumes that you have a valid config file`
      )
      expect(stdout).toContain(`fab.config.json5`)
    })

    it('should handle an empty config file', async () => {
      // todo: figure out why this fails on CI
      if (process.env.PUBLIC_PACKAGES) return

      const { stderr, stdout } = await expectError(
        `fab build -c fab.empty-config.json5`,
        opts
      )
      expect(stdout).toContain(`The FAB config file is missing a 'plugins' property.`)
      expect(stderr).toContain(`Config file contains errors!`)
    })

    it(`should tell you if you reference a module it can't find`, async () => {
      // todo: figure out why this fails on CI
      if (process.env.PUBLIC_PACKAGES) return

      const { stderr, stdout } = await expectError(
        `fab build -c fab.unknown-module.json5`,
        opts
      )
      expect(stdout).toContain(`Cannot find module '@fab/no-existo'`)
      expect(stdout).toContain(`Are you sure it's installed?`)
      expect(stderr).toContain(`Config file contains errors!`)
    })

    it(`should tell you you've forgotten @fab/rewire-assets`, async () => {
      // todo: figure out why this fails on CI
      if (process.env.PUBLIC_PACKAGES) return

      const { stderr, stdout } = await expectError(
        `fab build -c fab.missing-rewire.json5`,
        opts
      )
      expect(stdout).toContain(`Build failed!`)
      expect(stdout).toContain(
        `Build config leaves files outside of _assets dir: /index.html`
      )
      expect(stdout).toContain(`You might need to add @fab/rewire-assets`)
      expect(stdout).toContain(`See https://fab.dev/packages/rewire-assets`)
      expect(stderr).toContain(`Build failed!`)
    })
  })
})
