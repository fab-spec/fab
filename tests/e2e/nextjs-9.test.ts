import * as tmp from 'tmp-promise'
import * as fs from 'fs-extra'
import { shell, cmd } from '../utils'
import { ExecaChildProcess } from 'execa'

/*
it.skip('should allow creation of a new NextJS project into a FAB', async () => {
  const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
  await shell(`ls -l ${dir.path}`)
  await shell(`yarn create next-app nextjs9-test`, { cwd: dir.path })
  const cwd = `${dir.path}/nextjs9-test`
  const { stdout: files } = await cmd(`ls -l ${cwd}`)
  expect(files).toMatch('package.json')

  await shell(`fab init -y --skip-install --version=next`, { cwd })
  await shell(`yarn build:fab`, { cwd })

  const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
  expect(files_after_fab_build).toMatch('fab.zip')
})
*/

let next_port = 3210
const getPort = () => next_port++

describe('Create React App E2E Test', () => {
  let tmpdir: string
  let cwd: string

  it('should allow creation of a new NextJS project in a tmp dir', async () => {
    if (process.env.FAB_E2E_NEXTJS_DIR) {
      cwd = process.env.FAB_E2E_NEXTJS_DIR
      if (!cwd.startsWith('/var/folders/' || !cwd.endsWith('/nextjs-test'))) {
        // The value of FAB_E2E_NEXTJS_DIR doesn't match the above, exiting.
        process.exit(1)
      }
      await shell(`git reset --hard`, { cwd })
      await shell(`git clean -df`, { cwd })
    } else {
      // Create the tmp dir (inside the workspace if on Github Actions)
      const dir = await tmp.dir({ dir: process.env.GITHUB_WORKSPACE })
      tmpdir = dir.path
      expect(tmpdir).toMatch('tmp')

      // Create a new NextJS project inside
      await shell(`yarn create next-app nextjs-test`, { cwd: tmpdir })
      cwd = `${tmpdir}/nextjs-test`
    }
    // Expect that {cwd} has a package.json
    const { stdout: files } = await cmd(`ls -l`, { cwd })
    expect(files).toMatch('package.json')
  })

  it('should configure the NextJS project to produce FABs', async () => {
    await shell(`fab init -y --skip-install --version=next`, { cwd })
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

    const createServer = async (port: number) => {
      cancelServer()
      await shell(`rm -f fab.zip`, { cwd })
      await shell(`yarn fab:build`, { cwd })

      const { stdout: files_after_fab_build } = await cmd(`ls -l ${cwd}`)
      expect(files_after_fab_build).toMatch('fab.zip')

      server_process = cmd(`yarn fab:serve --port=${port}`, { cwd })
      // See if `server_process` explodes in the first 1 second (e.g. if the port is in use)
      await Promise.race([
        server_process,
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ])
    }

    const request = async (args: string, path: string, port: number) => {
      const curl_cmd = `curl ${args} --retry 5 --retry-connrefused http://localhost:${port}`
      const { stdout } = await shell(curl_cmd + path, { cwd })
      return stdout
    }

    it('should return a static page', async () => {
      const port = getPort()
      await createServer(port)
      expect(await request('-I', '/', port)).toContain(`HTTP/1.1 200 OK`)

      const homepage_response = await request('', '/', port)
      expect(homepage_response).toContain(`<!DOCTYPE html>`)
      expect(homepage_response).toContain(`window.FAB_SETTINGS`)
      expect(homepage_response).toContain(`"__fab_server":"@fab/server"`)
    })

    it('should return a dynamic page', async () => {
      const port = getPort()
      await createServer(port)
      expect(await request('-I', '/dynamic', port)).toContain(`HTTP/1.1 200 OK`)

      const dynamic_response = await request('', '/dynamic', port)
      expect(dynamic_response).toContain(`This page was rendered on the server`)
      const [_, number] = dynamic_response.match(/random number of (\d\.\d+)/)!
      expect(parseFloat(number)).toBeGreaterThanOrEqual(0)
      expect(parseFloat(number)).toBeLessThan(1)

      const second_response = await request('', '/dynamic', port)
      const [__, other_number] = second_response.match(/random number of (\d\.\d+)/)!
      expect(number).not.toEqual(other_number)
      expect(parseFloat(other_number)).toBeGreaterThanOrEqual(0)
      expect(parseFloat(other_number)).toBeLessThan(1)
    })

    afterAll(() => {
      cancelServer()
    })
  })
})
