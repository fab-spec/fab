import fs from 'fs-extra'
import { cmd, shell } from '../utils'
import { ExecaChildProcess } from 'execa'
import { buildFab, getPorts, getWorkingDir, NEXTJS_PORTS } from './helpers'
import path from 'path'
import globby from 'globby'

const getPort = getPorts(NEXTJS_PORTS)

describe('Nextjs E2E Test', () => {
  let cwd: string

  it('should create a new Next project', async () => {
    cwd = await getWorkingDir('nextjs-test', !process.env.FAB_E2E_SKIP_CREATE)
    const { stdout: current_sha } = await cmd(`git rev-parse --short HEAD`, { cwd })
    const { stdout: current_branch } = await cmd(`git rev-parse --abbrev-ref HEAD`, {
      cwd,
    })
    if (process.env.FAB_E2E_SKIP_CREATE) {
      console.log({ cwd })
      await shell(`git reset --hard`, { cwd })
      await shell(`git clean -df`, { cwd })
    } else {
      // Create a new NEXT project inside
      await shell(`yarn create next-app .`, { cwd })
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
      `echo "\\nconsole.log('[FAB CI] NextJS — Branch ${current_branch} (${current_sha})')" >> pages/index.js`,
      { cwd, shell: true }
    )
  })

  it('should configure the NextJS project to produce FABs', async () => {
    await shell(
      process.env.PUBLIC_PACKAGES ? 'npx fab init -y' : 'fab init -y --skip-install',
      {
        cwd,
      }
    )
    const { stdout: files_after_fab_init } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_init).toMatch('fab.config.json5')
    expect(files_after_fab_init).toMatch('next.config.js')

    await shell(`cp -R ${__dirname}/fixtures/nextjs/pages ${cwd}`)

    const package_json = JSON.parse(await fs.readFile(`${cwd}/package.json`, 'utf8'))
    package_json.scripts = {
      ...package_json.scripts,
      'fab:serve': 'fab serve fab.zip',
    }
    await fs.writeFile(`${cwd}/package.json`, JSON.stringify(package_json, null, 2))
    await shell(`yarn build:fab`, { cwd })

    const { stdout: built_pages } = await cmd(`ls -l ${cwd}/.next/serverless/pages`)
    expect(built_pages).toMatch('index.html')
    expect(built_pages).toMatch('dynamic.js')
    expect(built_pages).toMatch('_error.js')
    expect(built_pages).toMatch('background')

    const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
    expect(files_after_fab_build).toMatch('fab.zip')
  })

  describe('fab build tests', () => {
    let server_process: ExecaChildProcess | null = null
    let port: number

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

    const createServer = async (port: number) => {
      cancelServer()
      // Test that global builds work too
      if (process.env.PUBLIC_PACKAGES) {
        await buildFab(cwd, true)
      }
      await buildFab(cwd)

      const auto_install = process.env.PUBLIC_PACKAGES ? '--auto-install' : ''
      server_process = cmd(`yarn fab:serve ${auto_install} --port=${port}`, {
        cwd,
      })
      // See if `server_process` explodes in the first 1 second (e.g. if the port is in use)
      await Promise.race([
        server_process,
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ])
    }

    const request = async (args: string, path: string, port: number) => {
      const curl_cmd = `curl -s ${args} --retry 5 --retry-connrefused http://localhost:${port}`
      const { stdout } = await shell(curl_cmd + path, { cwd })
      return stdout
    }

    beforeAll(async () => {
      port = getPort()
      await createServer(port)
    })

    it('should return a static page', async () => {
      expect(await request('-I', '/', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`window.FAB_SETTINGS={}`)
    })

    it('should return a correct cache headers on immutable assets', async () => {
      const index_paths = await globby('static/chunks/pages/**/*.js', {
        cwd: path.join(cwd, '.next'),
      })
      if (index_paths.length === 0) {
        throw new Error('NextJS might have changed where it outputs static chunks')
      }

      for (const path of index_paths) {
        const static_chunk_path = await request('-I', `/_next/${path}`, port)
        expect(static_chunk_path).toContain(`HTTP/1.1 200 OK`)
        expect(static_chunk_path).toMatch(/Cache-Control:.*immutable/i)
        expect(static_chunk_path).toMatch(/Content-Type:.*application\/javascript/i)
        // expect(main_js_headers).toContain(`ETag`)
      }
    })

    it('should return a correct cache headers on mutable assets', async () => {
      const public_paths = await globby('*', { cwd: path.join(cwd, 'public') })
      if (public_paths.length === 0) {
        throw new Error('Expecting some non-fingerprinted files to live in /public')
      }
      for (const path of public_paths) {
        const mutable_asset = await request('-I', `/${path}`, port)
        expect(mutable_asset).toContain(`HTTP/1.1 200 OK`)
        expect(mutable_asset).toMatch(/Cache-Control:.*no-cache/i)
        // expect(favicon_headers).toContain(`ETag`)
      }
    })

    it('should return a dynamic page', async () => {
      expect(await request('-I', '/dynamic', port)).toContain(`HTTP/1.1 200 OK`)

      const dynamic_response = await request('', '/dynamic', port)
      expect(dynamic_response).toContain(`This page was rendered on the server`)
      const [_, number] = dynamic_response.match(/random number of[ <!\->]*(\d\.\d+)/)!
      expect(parseFloat(number)).toBeGreaterThanOrEqual(0)
      expect(parseFloat(number)).toBeLessThan(1)

      const second_response = await request('', '/dynamic', port)
      const [__, other_number] = second_response.match(
        /random number of[ <!\->]*(\d\.\d+)/
      )!
      expect(number).not.toEqual(other_number)
      expect(parseFloat(other_number)).toBeGreaterThanOrEqual(0)
      expect(parseFloat(other_number)).toBeLessThan(1)
    })

    it('should hit an API endpoint', async () => {
      expect(await request('-I', '/api/hello', port)).toContain(`HTTP/1.1 200 OK`)
      expect(await request('-I', '/api/time', port)).toContain(`HTTP/1.1 200 OK`)
      const time_response = JSON.parse(await request('', '/api/time', port))
      expect(time_response).toMatchObject({
        before: false,
        after: true,
      })
    })

    it('should render a page with a parameter in the url', async () => {
      expect(await request('-I', '/background/300', port)).toContain(`HTTP/1.1 200 OK`)
      expect(await request('-I', '/background/400', port)).toContain(`HTTP/1.1 200 OK`)

      const response_300 = await request('', '/background/300', port)
      expect(response_300).toContain(`Rendered with a background of size 300`)

      const response_400 = await request('', '/background/400', port)
      expect(response_400).toContain(`Rendered with a background of size 400`)
    })

    it('should render the NextJS error page', async () => {
      expect(await request('-I', '/lol', port)).toContain(`404`)

      const error_page = await request('', '/lol', port)
      expect(error_page).toContain(`This page could not be found`)
    })

    afterAll(() => {
      cancelServer()
    })
  })
})
