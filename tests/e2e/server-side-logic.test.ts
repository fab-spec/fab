import path from 'pat\h'
import { buildFab, SERVER_SIDE_LOGIC_PORTS, getPorts, getWorkingDir } from './helpers'
import fs from 'fs-extra'
import { cmd, _shell, shell } from '../utils'
import { ExecaChildProcess } from 'execa'
import { pathToSHA512 } from 'file-to-sha512'

const getPort = getPorts(SERVER_SIDE_LOGIC_PORTS)

describe('Server-side logic tests', () => {
  let cwd: string
  let cwd_shell: ReturnType<typeof _shell>

  beforeAll(async () => {
    cwd = await getWorkingDir('server-side-logic', true)
    cwd_shell = _shell(cwd)
  })

  it('should set up a simple FAB with a complex server chain', async () => {
    const src_dir = path.join(cwd, 'public')
    await fs.ensureDir(src_dir)
    await fs.copy(`${__dirname}/fixtures/server-side-logic`, cwd)
    if (process.env.PUBLIC_PACKAGES) {
      await cwd_shell(`yarn`)
    }
    await buildFab(cwd)
  })

  describe('server responses', () => {
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
      const curl_cmd = `curl ${args} --retry 2 --retry-connrefused http://localhost:${port}`
      const { stdout } = await shell(curl_cmd + path, { cwd })
      return stdout
    }

    beforeAll(async () => {
      port = getPort()
      await createServer(port)
    })

    afterAll(() => {
      cancelServer()
    })

    it('should hit the Hello World plugin', async () => {
      const bundle_id = (await pathToSHA512(`${cwd}/fab.zip`)).slice(0, 32)

      const homepage_headers = await request('-I', '/', port)
      expect(homepage_headers).toContain(`HTTP/1.1 200 OK`)
      expect(homepage_headers).toContain(`X-FAB-ID: ${bundle_id}`)
      expect(await request('-I', '/hello', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<title>INDEX HTML</title>`)
      expect(homepage_response).toContain(`<h1>This is the default fallback.</h1>`)
      expect(homepage_response).toContain(`window.FAB_SETTINGS={}`)

      const hello_response = await request('', '/hello', port)
      expect(hello_response).not.toEqual(homepage_response)
      expect(hello_response).toContain('HELLO WORLD!')

      const hello_fab_response = await request('', '/hello/fab', port)
      expect(hello_fab_response).not.toEqual(homepage_response)
      expect(hello_fab_response).toContain('HELLO FAB!')

      const alt_response = await request('', '/alt', port)
      expect(alt_response).not.toEqual(homepage_response)
      expect(alt_response).toContain(`<title>ALTERNATIVE HTML</title>`)
      expect(alt_response).toContain(`<h1>This should be served under /alt URLs.</h1>`)
      expect(alt_response).toContain(`window.FAB_SETTINGS={}`)

      const alt_sub_response = await request('', '/alt/fab', port)
      expect(alt_sub_response).toEqual(alt_response)

      const wrong_mutation_response = await request('', '/mutate-url-doesnt-work', port)
      expect(wrong_mutation_response).toEqual(homepage_response)
    })

    it('should hit a complex plugin precompiled with Webpack', async () => {
      const webpack_response = await request('', '/webpack-plugin-test', port)
      expect(webpack_response).toContain(
        `Testing 'fs' shim: FILESYSTEM LOOKS LIKE IT WORKS`
      )
      expect(webpack_response).toContain(`Testing 'alias' override: {}`)
      expect(webpack_response).toContain(
        `Testing 'webpack' DefinePlugin: {"replace_me":"WITH_ME"}`
      )
      expect(webpack_response).toContain(
        `Testing 'args' wiring up: {"other_data":"passed through as normal"}`
      )
    })

    it('should hit a streaming endpoint', async () => {
      const promise = cwd_shell(`curl -sN http://localhost:${port}/slowly`)

      const lines_with_timestamps: { [line: string]: Date } = {}
      promise.stdout!.on('data', (data) => {
        data
          .toString()
          .split('\n')
          .forEach((line: string) => {
            lines_with_timestamps[line.trim()] = new Date()
          })
      })

      await promise

      const des_time = lines_with_timestamps['Des'].getTime()
      const pa_time = lines_with_timestamps['pa'].getTime()
      const cito_time = lines_with_timestamps['cito.'].getTime()

      expect(pa_time - des_time).toBeGreaterThan(100)
      expect(pa_time - des_time).toBeLessThan(900)
      expect(cito_time - pa_time).toBeGreaterThan(100)
      expect(cito_time - pa_time).toBeLessThan(900)
      expect(cito_time - des_time).toBeGreaterThan(500)
      expect(cito_time - des_time).toBeLessThan(1500)
    })

    /* Generic version of the previous test case, testing different interplays
     * between streams and caches. */
    describe('should hit endpoints with different caching/streaming timings', () => {
      const cases = [
        // { endpoint: '/return-fetch', initial_delay: 0, line_delay: 500 },
        { endpoint: '/fetch-return-body', initial_delay: 0, line_delay: 500 },
        { endpoint: '/fetch-await-body', initial_delay: 1000, line_delay: 0 },
        { endpoint: '/cache-stream-return-buffer', initial_delay: 1000, line_delay: 0 },
        { endpoint: '/cache-stream-return-stream', initial_delay: 1000, line_delay: 0 },
        { endpoint: '/fetch-cache-return-buffer', initial_delay: 1000, line_delay: 0 },
        { endpoint: '/fetch-cache-return-stream', initial_delay: 1000, line_delay: 0 },
        { endpoint: '/fetch-cache-accum-return', initial_delay: 1000, line_delay: 0 },
      ]
      cases.forEach(({ endpoint, initial_delay, line_delay }) => {
        it(`should observe the correct timings on ${endpoint}`, async () => {
          const starting_time = new Date().getTime()

          const promise = cwd_shell(`curl -sN http://localhost:${port}${endpoint}`)
          let stdout = ''

          const lines_with_timestamps: { [line: string]: Date } = {}
          promise.stdout!.on('data', (data) => {
            const chunk = data.toString()
            stdout += chunk
            chunk.split('\n').forEach((line: string) => {
              lines_with_timestamps[line.trim()] = new Date()
            })
          })

          await promise

          expect(stdout).toContain('Des\npa\ncito')

          const des_time = lines_with_timestamps['Des'].getTime()
          const pa_time = lines_with_timestamps['pa'].getTime()
          const cito_time = lines_with_timestamps['cito.'].getTime()

          // Assert that the response takes a while to arrive, but then arrives all at once.
          expect(des_time - starting_time).toBeGreaterThan(initial_delay - 100)
          expect(des_time - starting_time).toBeLessThan(initial_delay + 100)
          expect(pa_time - des_time).toBeGreaterThan(line_delay - 100)
          expect(pa_time - des_time).toBeLessThan(line_delay + 100)
          expect(cito_time - pa_time).toBeGreaterThan(line_delay - 100)
          expect(cito_time - pa_time).toBeLessThan(line_delay + 100)
          expect(cito_time - des_time).toBeGreaterThan(line_delay * 2 - 100)
          expect(cito_time - des_time).toBeLessThan(line_delay * 2 + 100)
        })
      })
    })
  })
})
