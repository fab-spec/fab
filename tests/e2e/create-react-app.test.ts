import fs from 'fs-extra'
import { cmd, shell } from '../utils'
import { ExecaChildProcess } from 'execa'
import { JSON5Config } from '@fab/cli'
import globby from 'globby'
// @ts-ignore
import md5file from 'md5-file/promise'
import { buildFab, getPort, getWorkingDir } from './helpers'

describe('Create React App E2E Test', () => {
  let tmpdir: string
  let cwd: string

  it('should create a new CRA project', async () => {
    cwd = await getWorkingDir('cra-test', !process.env.FAB_E2E_SKIP_CREATE)
    if (process.env.FAB_E2E_SKIP_CREATE) {
      console.log({ cwd })
      await shell(`git reset --hard`, { cwd })
      await shell(`git clean -df`, { cwd })
    } else {
      // Create a new CRA project inside
      await shell(`yarn create react-app .`, { cwd })
      // Skip git stuff on Github, it's only for rerunning locally
      if (!process.env.GITHUB_WORKSPACE) {
        await shell(`git init`, { cwd })
        await shell(`git add .`, { cwd })
        await shell(`git commit -m CREATED`, { cwd })
      }
    }
    // Expect that {cwd} has a package.json
    const { stdout: files } = await cmd(`ls -l`, { cwd })
    expect(files).toMatch('package.json')
  })

  it('should configure the CRA project to produce FABs', async () => {
    // CRA normally doesn't like running in a directory with a package.json higher up
    // for some particular dependency but it's not failing any more?
    // await fs.writeFile(`${cwd}/.env`, `SKIP_PREFLIGHT_CHECK=true`)
    // await shell(`cat .env`, { cwd })
    await shell(`fab init -y ${process.env.PUBLIC_PACKAGES ? '' : '--skip-install'}`, {
      cwd,
    })
    const { stdout: files_after_fab_init } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_init).toMatch('fab.config.json5')

    const package_json = JSON.parse(await fs.readFile(`${cwd}/package.json`, 'utf8'))
    package_json.scripts = {
      ...package_json.scripts,
      'fab:serve': 'fab serve fab.zip',
    }
    await fs.writeFile(`${cwd}/package.json`, JSON.stringify(package_json, null, 2))
    await shell(`yarn build:fab`, { cwd })

    const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_build).toMatch('fab.zip')
  })

  describe('fab build tests', () => {
    let server_process: ExecaChildProcess | null = null

    const cancelServer = () => {
      console.log('CANCELLING')
      console.log({ server_process: server_process?.constructor?.name })
      if (server_process) {
        try {
          server_process.cancel()
        } catch (e) {
          console.log('CANCELLED')
        }
        server_process = null
      }
    }

    const createServer = async (port: number, args: string = '') => {
      cancelServer()

      server_process = cmd(`yarn fab:serve --port=${port} ${args}`, { cwd })
      // See if `server_process` explodes in the first 2 seconds (e.g. if the port is in use)
      await Promise.race([
        server_process,
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ])
    }

    const request = async (args: string, path: string, port: number) => {
      const curl_cmd = `curl ${args} --retry 2 --retry-connrefused http://localhost:${port}`
      const { stdout } = await shell(curl_cmd + path, { cwd })
      return stdout
    }

    it('should return a 200 on / and /hello', async () => {
      // Test that global builds work too
      if (process.env.PUBLIC_PACKAGES) {
        await buildFab(cwd, true)
      }
      await buildFab(cwd)
      const port = getPort()
      await createServer(port)
      expect(await request('-I', '/', port)).toContain(`HTTP/1.1 200 OK`)
      expect(await request('-I', '/hello', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`window.FAB_SETTINGS`)
      expect(homepage_response).toContain(`"__fab_server":"@fab/server"`)

      const hello_response = await request('', '/hello', port)
      expect(hello_response).toEqual(homepage_response)
    })

    it('should return a correct cache headers on assets', async () => {
      await buildFab(cwd)
      const port = getPort()
      await createServer(port)

      const main_js = await globby('build/static/js/main*.js', { cwd })
      console.log({ main_js })
    })

    it('should allow a plugin to override /hello', async () => {
      await fs.ensureDir(`${cwd}/fab-plugins`)
      await fs.writeFile(
        `${cwd}/fab-plugins/hello-world.js`,
        // language=JavaScript
        `
        export const runtime = (args, metadata) => {
          return async ({ url }) => {
            if (url.pathname === '/hello') {
              return new Response('HELLO WORLD!\\n', {
                status: 200
              })
            }
          }
        }
        `
      )

      const config = await JSON5Config.readFrom(`${cwd}/fab.config.json5`)
      config.data.plugins['./fab-plugins/hello-world'] = {}
      await config.write(`${cwd}/fab.config.json5`)

      await buildFab(cwd)
      const port = getPort()
      await createServer(port)
      expect(await request('-I', '/', port)).toContain(`HTTP/1.1 200 OK`)
      expect(await request('-I', '/hello', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`window.FAB_SETTINGS`)
      expect(homepage_response).toContain(`"__fab_server":"@fab/server"`)

      const hello_response = await request('', '/hello', port)
      expect(hello_response).not.toEqual(homepage_response)
      expect(hello_response).toContain('HELLO WORLD!')
    })

    it('should reflect settings changes', async () => {
      await buildFab(cwd)
      const first_fab_md5 = await md5file(`${cwd}/fab.zip`)
      console.log({ first_fab_md5 })

      const config = await JSON5Config.readFrom(`${cwd}/fab.config.json5`)
      config.data.settings!.production.E2E_TEST = 'extremely working!'
      config.data.settings!.production.OTHER_SETTING = 'production value'
      await config.write(`${cwd}/fab.config.json5`)

      await buildFab(cwd)
      const second_fab_md5 = await md5file(`${cwd}/fab.zip`)
      console.log({ second_fab_md5 })
      expect(second_fab_md5).not.toEqual(first_fab_md5)

      const port = getPort()
      await createServer(port)
      expect(await request('-I', '/', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`"E2E_TEST":"extremely working!"`)
      expect(homepage_response).toContain(`"OTHER_SETTING":"production value"`)

      config.data.settings!.staging = { E2E_TEST: 'totes overridden!' }
      await config.write(`${cwd}/fab.config.json5`)
      await buildFab(cwd)
      const third_fab_md5 = await md5file(`${cwd}/fab.zip`)
      console.log({ third_fab_md5 })
      // Changing non-production settings doesn't change the bundle id
      expect(third_fab_md5).toEqual(second_fab_md5)

      const next_port = getPort()
      await createServer(next_port, '--env=staging')
      expect(await request('-I', '/', next_port)).toContain(`HTTP/1.1 200 OK`)

      const staging_response = await request('', '/', next_port)
      expect(staging_response).toContain(`<!DOCTYPE html>`)
      expect(staging_response).toContain(`"E2E_TEST":"totes overridden!"`)
      expect(staging_response).not.toContain(`"E2E_TEST":"extremely working!"`)
      expect(staging_response).toContain(`"OTHER_SETTING":"production value"`)
    })

    afterAll(() => {
      cancelServer()
    })
  })
})
