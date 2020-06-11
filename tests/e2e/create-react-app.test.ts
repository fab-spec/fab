import fs from 'fs-extra'
import { cmd, shell } from '../utils'
import { ExecaChildProcess } from 'execa'
import globby from 'globby'
import { buildFab, CRA_PORTS, getPorts, getWorkingDir } from './helpers'
import path from 'path'
import jju from 'jju'
import { pathToSHA512 } from 'file-to-sha512'

const getPort = getPorts(CRA_PORTS)

describe('Create React App E2E Test', () => {
  let cwd: string

  it('should create a new CRA project', async () => {
    cwd = await getWorkingDir('cra-test', !process.env.FAB_E2E_SKIP_CREATE)
    const { stdout: current_sha } = await cmd(`git rev-parse --short HEAD`, {
      cwd,
    })
    const { stdout: current_branch } = await cmd(`git rev-parse --abbrev-ref HEAD`, {
      cwd,
    })
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
    // Add the FAB project's current commit SHA to index.js for debugging
    await shell(
      `echo "\\nconsole.log('[FAB CI] Create React App — Branch ${current_branch} (${current_sha})')" >> src/index.js`,
      { cwd, shell: true }
    )
  })

  it('should configure the CRA project to produce FABs', async () => {
    // CRA doesn't like running in a directory with a package.json higher up
    // with a different version of Webpack.
    await fs.writeFile(`${cwd}/.env`, `SKIP_PREFLIGHT_CHECK=true`)
    await shell(`cat .env`, { cwd })
    await shell(
      process.env.PUBLIC_PACKAGES ? 'npx fab init -y' : 'fab init -y --skip-install',
      {
        cwd,
      }
    )
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
      // console.log('CANCELLING')
      // console.log({ server_process: server_process?.constructor?.name })
      if (server_process) {
        try {
          server_process.cancel()
        } catch (e) {
          // console.log('CANCELLED')
        }
        server_process = null
      }
    }

    const createServer = async (port: number, args: string = '') => {
      cancelServer()

      const auto_install = process.env.PUBLIC_PACKAGES ? '--auto-install' : ''
      server_process = cmd(`yarn fab:serve ${auto_install} --port=${port} ${args}`, {
        cwd,
      })
      // See if `server_process` explodes in the first 2 seconds (e.g. if the port is in use)
      await Promise.race([
        server_process,
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ])
    }

    const request = async (args: string, path: string, port: number) => {
      const curl_cmd = `curl ${args} --retry 5 --retry-connrefused http://localhost:${port}`
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
      expect(homepage_response).toContain(`window.FAB_SETTINGS={}`)

      const hello_response = await request('', '/hello', port)
      expect(hello_response).toEqual(homepage_response)
    })

    it('should return a correct cache headers on assets', async () => {
      await buildFab(cwd)
      const port = getPort()
      await createServer(port)

      // await shell('tree build', { cwd })

      const globs = await globby('static/js/main*.js', {
        cwd: path.join(cwd, 'build'),
      })
      const main_js = globs[0]
      console.log({ main_js })
      expect(main_js).toBeDefined()

      const main_js_headers = await request('-I', `/${main_js}`, port)
      expect(main_js_headers).toContain(`HTTP/1.1 200 OK`)
      expect(main_js_headers).toMatch(/Cache-Control:.*immutable/i)
      expect(main_js_headers).toMatch(/Content-Type:.*application\/javascript/i)
      expect(main_js_headers).toContain(`ETag`)

      const favicon_headers = await request('-I', `/favicon.ico`, port)
      expect(favicon_headers).toContain(`HTTP/1.1 200 OK`)
      expect(favicon_headers).toMatch(/Cache-Control:.*no-cache/i)
      expect(favicon_headers).toMatch(/Content-Type:.*image\/vnd\.microsoft\.icon/i)
      // expect(favicon_headers).toContain(`ETag`)
    })

    it('should allow a plugin to override /hello', async () => {
      await fs.ensureDir(`${cwd}/fab-plugins`)
      await fs.writeFile(
        `${cwd}/fab-plugins/hello-world.js`,
        // language=JavaScript
        `
        export default ({ Router }) => {
          Router.on('/hello/:whom?', async ({ params }) => {
            const { whom = 'world' } = params
            return new Response('HELLO ' + whom.toUpperCase() + '!\\n', {
              status: 200,
            })
          })
        }
        `
      )
      const config = jju.parse(await fs.readFile(`${cwd}/fab.config.json5`, 'utf8'))
      config.plugins['./fab-plugins/hello-world'] = {}
      await fs.writeFile(`${cwd}/fab.config.json5`, jju.stringify(config))

      await buildFab(cwd)
      const port = getPort()
      await createServer(port)
      expect(await request('-I', '/', port)).toContain(`HTTP/1.1 200 OK`)
      expect(await request('-I', '/hello', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`window.FAB_SETTINGS={}`)

      const hello_response = await request('', '/hello', port)
      expect(hello_response).not.toEqual(homepage_response)
      expect(hello_response).toContain('HELLO WORLD!')

      const hello_fab_response = await request('', '/hello/fab', port)
      expect(hello_fab_response).not.toEqual(homepage_response)
      expect(hello_fab_response).toContain('HELLO FAB!')
    })

    it('should reflect settings changes', async () => {
      await buildFab(cwd)
      const first_fab_sha = (await pathToSHA512(`${cwd}/fab.zip`)).slice(0, 32)

      const config = jju.parse(await fs.readFile(`${cwd}/fab.config.json5`, 'utf8'))
      config.settings.production.E2E_TEST = 'extremely working!'
      config.settings.production.OTHER_SETTING = 'production value'
      config.settings.production._GOVERNMENT_SECRETS = 'DO_NOT_INJECT'
      await fs.writeFile(`${cwd}/fab.config.json5`, jju.stringify(config))

      await buildFab(cwd)
      const second_fab_sha = (await pathToSHA512(`${cwd}/fab.zip`)).slice(0, 32)
      expect(second_fab_sha).not.toEqual(first_fab_sha)

      const port = getPort()
      await createServer(port)
      expect(await request('-I', '/', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`"E2E_TEST":"extremely working!"`)
      expect(homepage_response).toContain(`"OTHER_SETTING":"production value"`)
      expect(homepage_response).not.toContain(`_GOVERNMENT_SECRETS`)
      expect(homepage_response).not.toContain(`DO_NOT_INJECT`)

      config.settings!.staging = { E2E_TEST: 'totes overridden!' }
      await fs.writeFile(`${cwd}/fab.config.json5`, jju.stringify(config))
      await buildFab(cwd)
      const third_fab_sha = (await pathToSHA512(`${cwd}/fab.zip`)).slice(0, 32)

      // Changing non-production settings doesn't change the bundle id
      expect(third_fab_sha).toEqual(second_fab_sha)

      const next_port = getPort()
      await createServer(next_port, '--env=staging')
      expect(await request('-I', '/', next_port)).toContain(`HTTP/1.1 200 OK`)

      const staging_response = await request('', '/', next_port)
      expect(staging_response).toContain(`<!DOCTYPE html>`)
      expect(staging_response).toContain(`"E2E_TEST":"totes overridden!"`)
      expect(staging_response).not.toContain(`"E2E_TEST":"extremely working!"`)
      expect(staging_response).toContain(`"OTHER_SETTING":"production value"`)
    })

    it('should permit caching data between requests', async () => {
      await fs.ensureDir(`${cwd}/fab-plugins`)
      await fs.writeFile(
        `${cwd}/fab-plugins/counter.js`,
        // language=JavaScript
        `
        export default ({ Router, Cache }) => {
          Router.on('/counter', async () => {
            const n = (await Cache.getNumber('cache-test')) || 0
            await Cache.set('cache-test', n + 1)
            return new Response(\`This page has been called $\{n + 1} times.\\n\`)
          })
        }
        `
      )
      const config = jju.parse(await fs.readFile(`${cwd}/fab.config.json5`, 'utf8'))
      config.plugins['./fab-plugins/counter'] = {}
      await fs.writeFile(`${cwd}/fab.config.json5`, jju.stringify(config))

      await buildFab(cwd)
      const port = getPort()
      await createServer(port)

      const response_one = await request('', '/counter', port)
      expect(response_one).toContain('This page has been called 1 times.')

      const response_two = await request('', '/counter', port)
      expect(response_two).toContain('This page has been called 2 times.')
    })

    afterAll(() => {
      cancelServer()
    })
  })
})
