import * as tmp from 'tmp-promise'
import * as fs from 'fs-extra'
import { shell, cmd } from '../utils'
import * as execa from 'execa'
import { ExecaChildProcess } from 'execa'

describe('Create React App E2E Test', () => {
  let tmpdir: string
  let cwd: string

  it('should allow creation of a tmp dir', async () => {
    const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
    tmpdir = dir.path
    await shell(`ls -l ${tmpdir}`)
    const { stdout } = await cmd(`pwd`, { cwd: tmpdir })
    expect(stdout).toMatch('tmp')
  })

  it('should allow creation of a new CRA project into a FAB', async () => {
    await shell(`ls -l ${tmpdir}`)
    await shell(`yarn create react-app cra-test`, { cwd: tmpdir })
    cwd = `${tmpdir}/cra-test`
    const { stdout: files } = await cmd(`ls -l ${cwd}`)
    expect(files).toMatch('package.json')

    await fs.writeFile(`${cwd}/.env`, `SKIP_PREFLIGHT_CHECK=true`)
    await shell(`cat .env`, { cwd })
    await shell(`fab init -y --skip-install --version=next`, { cwd })
    const { stdout: files_after_fab_init } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_init).toMatch('fab.config.json5')

    const package_json = JSON.parse(await fs.readFile(`${cwd}/package.json`, 'utf8'))
    package_json.scripts = {
      ...package_json.scripts,
      'fab:serve': 'fab serve fab.zip --port=3123',
    }
    await fs.writeFile(`${cwd}/package.json`, JSON.stringify(package_json, null, 2))

    // const { stdout: test_fab_output } = await cmd(`yarn test:fab`, { cwd })
    //
    // expect(test_fab_output).toMatch(
    //   /^<!DOCTYPE html>.*<script>window.FAB_SETTINGS={.*"__fab_server":"@fab\/server"/
    // )

    // Add a runtime plugin that returns some response
    // Then test for that response.
  })

  describe('fab build tests', () => {
    let server_process: ExecaChildProcess | undefined

    const request = async (args: string, path: string) => {
      const curl_cmd = `curl ${args} --retry 5 --retry-connrefused http://localhost:3123`
      const { stdout } = await cmd(curl_cmd + path, { cwd })
      return stdout
    }

    beforeEach(async () => {
      await shell(`rm -f fab.zip`, { cwd })
      await shell(`yarn build:fab`, { cwd })

      const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
      expect(files_after_fab_build).toMatch('fab.zip')

      server_process = cmd('yarn fab:serve', { cwd })
      console.log({ server_process })
    })

    it('should return a 200 on /', async () => {
      expect(await request('-I', '/')).toContain(`HTTP/1.1 200 OK`)
      const homepage_response = await request('', '/')
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`window.FAB_SETTINGS`)
      expect(homepage_response).toContain(`"__fab_server":"@fab/server"`)
    })

    afterEach(async () => {
      if (server_process) await server_process.cancel()
    })
  })
})
