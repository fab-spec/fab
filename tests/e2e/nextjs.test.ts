import fs from 'fs-extra'
import { cmd, shell } from '../utils'
import { buildFab, cancelServer, createServer, getWorkingDir, request } from './helpers'
import path from 'path'
import globby from 'globby'
import shellac from 'shellac'

describe('Nextjs E2E Test', () => {
  let cwd: string

  it('should create a new Next project', async () => {
    cwd = await getWorkingDir('nextjs-test', Boolean(process.env.FAB_E2E_CLEAN))

    const { fab_sha, fab_branch } = await shellac.in(__dirname)`
      $ git rev-parse --short HEAD
      stdout >> fab_sha

      $ git rev-parse --abbrev-ref HEAD
      stdout >> fab_branch
    `

    await shellac.in(cwd)`
      if ${await fs.pathExists(path.join(cwd, '.git'))} {
        $$ echo "Reusing existing NextJS app in ${cwd}. Use FAB_E2E_CLEAN=true to skip."
        $ git reset --hard
        $ git clean -df
        $ rm -rf .next out build
      } else {
        $ rm -rf *
        $$ yarn create next-app .

        $$ git init
        $ git add .
        $ GIT_COMMITTER_NAME=FAB GIT_COMMITTER_EMAIL=ci@fab.dev git commit -m 'post create' --author "FAB CI <>" --allow-empty
      }

      $ ls -l
      stdout >> ${(files) => expect(files).toMatch('package.json')}

      $ echo "\\\\nconsole.log('[FAB CI] NextJS — Branch ${fab_sha} (${fab_branch})')" >> pages/index.js
    `
  })

  it('should configure the NextJS project to produce FABs', async () => {
    await shellac.in(cwd)`
      if ${process.env.PUBLIC_PACKAGES} {
        $ npx fab init -y
      } else {
        $ fab init -y --skip-install
      }

      $ ls -l
      stdout >> ${(files) => {
        expect(files).toMatch('fab.config.json5')
        expect(files).toMatch('next.config.js')
      }}

      $ cp -R ${__dirname}/fixtures/nextjs/pages .

      $$ ./node_modules/.bin/next build

      $ ls -l .next/serverless/pages
      stdout >> ${(built_pages) => {
        expect(built_pages).toMatch('index.html')
        expect(built_pages).toMatch('dynamic.js')
        expect(built_pages).toMatch('_error.js')
        expect(built_pages).toMatch('background')
      }}

      $$ yarn fab:build

      $ ls -l
      stdout >> ${(files) => {
        expect(files).toMatch('fab.zip')
      }}
    `
  })

  // describe('fab build tests', () => {
  //   beforeAll(async () => {
  //     // Test that global builds work too
  //     if (process.env.PUBLIC_PACKAGES) {
  //       await buildFab(cwd, true)
  //     }
  //     await buildFab(cwd)
  //     await createServer(cwd)
  //   })
  //
  //   it('should return a static page', async () => {
  //     expect(await request('-I', '/')).toContain(`HTTP/1.1 200 OK`)
  //
  //     const homepage_response = await request('', '/')
  //     expect(homepage_response).toContain(`<!DOCTYPE html>`)
  //     expect(homepage_response).toContain(`window.FAB_SETTINGS={}`)
  //   })
  //
  //   it('should return a correct cache headers on immutable assets', async () => {
  //     const index_paths = await globby('static/chunks/pages/**/*.js', {
  //       cwd: path.join(cwd, '.next'),
  //     })
  //     if (index_paths.length === 0) {
  //       throw new Error('NextJS might have changed where it outputs static chunks')
  //     }
  //
  //     for (const path of index_paths) {
  //       const static_chunk_path = await request('-I', `/_next/${path}`)
  //       expect(static_chunk_path).toContain(`HTTP/1.1 200 OK`)
  //       expect(static_chunk_path).toMatch(/Cache-Control:.*immutable/i)
  //       expect(static_chunk_path).toMatch(/Content-Type:.*application\/javascript/i)
  //       // expect(main_js_headers).toContain(`ETag`)
  //     }
  //   })
  //
  //   it('should return a correct cache headers on mutable assets', async () => {
  //     const public_paths = await globby('*', { cwd: path.join(cwd, 'public') })
  //     if (public_paths.length === 0) {
  //       throw new Error('Expecting some non-fingerprinted files to live in /public')
  //     }
  //     for (const path of public_paths) {
  //       const mutable_asset = await request('-I', `/${path}`)
  //       expect(mutable_asset).toContain(`HTTP/1.1 200 OK`)
  //       expect(mutable_asset).toMatch(/Cache-Control:.*no-cache/i)
  //       // expect(favicon_headers).toContain(`ETag`)
  //     }
  //   })
  //
  //   it('should return a dynamic page', async () => {
  //     expect(await request('-I', '/dynamic')).toContain(`HTTP/1.1 200 OK`)
  //
  //     const dynamic_response = await request('', '/dynamic')
  //     expect(dynamic_response).toContain(`This page was rendered on the server`)
  //     const [_, number] = dynamic_response.match(/random number of[ <!\->]*(\d\.\d+)/)!
  //     expect(parseFloat(number)).toBeGreaterThanOrEqual(0)
  //     expect(parseFloat(number)).toBeLessThan(1)
  //
  //     const second_response = await request('', '/dynamic')
  //     const [__, other_number] = second_response.match(
  //       /random number of[ <!\->]*(\d\.\d+)/
  //     )!
  //     expect(number).not.toEqual(other_number)
  //     expect(parseFloat(other_number)).toBeGreaterThanOrEqual(0)
  //     expect(parseFloat(other_number)).toBeLessThan(1)
  //   })
  //
  //   it('should hit an API endpoint', async () => {
  //     expect(await request('-I', '/api/hello')).toContain(`HTTP/1.1 200 OK`)
  //     expect(await request('-I', '/api/time')).toContain(`HTTP/1.1 200 OK`)
  //     const time_response = JSON.parse(await request('', '/api/time'))
  //     expect(time_response).toMatchObject({
  //       before: false,
  //       after: true,
  //     })
  //   })
  //
  //   it('should render a page with a parameter in the url', async () => {
  //     expect(await request('-I', '/background/300')).toContain(`HTTP/1.1 200 OK`)
  //     expect(await request('-I', '/background/400')).toContain(`HTTP/1.1 200 OK`)
  //
  //     const response_300 = await request('', '/background/300')
  //     expect(response_300).toContain(`Rendered with a background of size 300`)
  //
  //     const response_400 = await request('', '/background/400')
  //     expect(response_400).toContain(`Rendered with a background of size 400`)
  //   })
  //
  //   it('should render the NextJS error page', async () => {
  //     expect(await request('-I', '/lol')).toContain(`404`)
  //
  //     const error_page = await request('', '/lol')
  //     expect(error_page).toContain(`This page could not be found`)
  //   })
  //
  //   afterAll(() => {
  //     cancelServer()
  //   })
  // })
})
