import fs from 'fs-extra'
import {
  buildFab,
  cancelServer,
  createServer,
  getCurrentCommitInfo,
  getWorkingDir,
  request,
  FAB_PACKAGE_NAMES,
} from './helpers'
import path from 'path'
import globby from 'globby'
import shellac from 'shellac'

describe('Flareact E2E Test', () => {
  let cwd: string

  it('should create a new Flareact project', async () => {
    cwd = await getWorkingDir('flareact-test', Boolean(process.env.FAB_E2E_CLEAN))

    const { fab_sha, fab_branch } = await getCurrentCommitInfo()

    await shellac.in(cwd)`
      if ${await fs.pathExists(path.join(cwd, '.git'))} {
        $$ echo "Reusing existing Flareact app in ${cwd}. Use FAB_E2E_CLEAN=true to skip."
        $ git reset --hard
        $ git clean -df
        $ rm -rf dist out public
      } else {
        $$ echo "Creating new Flareact app in ${cwd}."
        $ rm -rf *
        $$ git clone git@github.com:abdelhamid-attaby/flareact-fab-sandbox.git --depth=1 .

        $$ git remote remove origin
      }

      $ ls -l
      stdout >> ${(files) => expect(files).toMatch('package.json')}
    `
  })

  it('should configure the Flareact project to produce FABs', async () => {
    await shellac.in(cwd)`
      if ${process.env.PUBLIC_PACKAGES} {
        $ npx --ignore-existing fab init -y
      } else {
        $$ echo "TODO — REMOVE THESE TWO LINES ONCE THE PUBLISHED @fab/cli INCLUDES FLAREACT"
        $$ yarn add @fab/cli @fab/core
        $$ yarn link @fab/cli @fab/core
        $$ yarn fab init -y
        $$ yarn link ${FAB_PACKAGE_NAMES}
      }

      $ ls -l
      stdout >> ${(files) => {
        expect(files).toMatch('fab.config.json5')
      }}
    `
  })

  it('should build a fab before we run any tests', async () => {
    await buildFab(cwd)
  })

  describe('fab build tests', () => {
    beforeAll(async () => {
      await createServer(cwd)
    })

    it('should return a static page', async () => {
      expect(await request('-I', '/')).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/')
      expect(homepage_response).toContain(`Flareact Fab Sandbox`)
    })

    afterAll(() => {
      cancelServer()
    })
  })
})
