import { expectError, shell } from '../utils'
import { FAB_PACKAGE_NAMES, getWorkingDir } from './helpers'
import shellac from 'shellac'

describe('dir of static assets', () => {
  let cwd: string
  beforeAll(async () => {
    cwd = await getWorkingDir('static', false)
    await shellac.in(cwd)`
      $ rm -rf *
      $$ echo Resetting ${cwd}
      $ cp -R ${__dirname}/fixtures/static/* .
      $ npm init -y
      $$ yarn link ${FAB_PACKAGE_NAMES}
    `
  })

  describe('failure cases', () => {
    it('should handle a missing config file', async () => {
      const { stderr, stdout } = await expectError(`npx fab build`, { cwd })
      expect(stderr).toContain(`Error: Missing config file`)
      expect(stderr).toContain(`fab.config.json5`)
      expect(stdout).toContain(
        `All FAB tooling assumes that you have a valid config file`
      )
      expect(stdout).toContain(`fab.config.json5`)
    })

    it('should handle an empty config file', async () => {
      const {
        stderr,
        stdout,
      } = await expectError(`npx fab build -c fab.empty-config.json5`, { cwd })
      expect(stdout).toContain(`The FAB config file is missing a 'plugins' property.`)
      expect(stderr).toContain(`Config file contains errors!`)
    })

    it(`should tell you if you reference a module it can't find`, async () => {
      const {
        stderr,
        stdout,
      } = await expectError(`fab build -c fab.unknown-module.json5`, { cwd })
      expect(stdout).toContain(`Cannot find module '@fab/no-existo'`)
      expect(stdout).toContain(`Are you sure it's installed?`)
      expect(stderr).toContain(`Config file contains errors!`)
    })

    it(`should tell you you've forgotten @fab/plugin-rewire-assets`, async () => {
      const {
        stderr,
        stdout,
      } = await expectError(`npx fab build -c fab.missing-rewire.json5`, { cwd })
      expect(stdout).toContain(`Build failed!`)
      expect(stdout).toContain(
        `Build config leaves files outside of _assets dir: /index.html`
      )
      expect(stdout).toContain(`You might need to add @fab/plugin-rewire-assets`)
      expect(stdout).toContain(`See https://fab.dev/packages/rewire-assets`)
      expect(stderr).toContain(`Build failed!`)
    })
  })
})
