import { getWorkingDir } from './helpers'
import shellac from 'shellac'
import fs from 'fs-extra'
import path from 'path'

const exampleApps = [
  'active-class-name',
  'amp-first',
  'amp-story',
  'amp',
  'analyze-bundles',
  'api-routes-apollo-server-and-client-auth',
  'api-routes-apollo-server-and-client',
  'api-routes-apollo-server',
  'api-routes-cors',
  'api-routes-graphql',
  'api-routes-middleware',
  'api-routes-rate-limit',
  'api-routes-rest',
  'api-routes',
  'auth0',
  'basic-css',
  'basic-export',
  'blog-starter-typescript',
  'blog-starter',
  'catch-all-routes',
  'cms-agilitycms',
  'cms-buttercms',
  'cms-contentful',
  'cms-cosmic',
  'cms-datocms',
  'cms-ghost',
  'cms-graphcms',
  'cms-kontent',
  'cms-prepr',
  'cms-prismic',
  'cms-sanity',
  'cms-storyblok',
  'cms-strapi',
  'cms-takeshape',
  'cms-wordpress',
  'custom-routes-proxying',
  'custom-server-actionhero',
  'custom-server-express',
  'custom-server-fastify',
  'custom-server-hapi',
  'custom-server-koa',
  'custom-server-polka',
  'custom-server-typescript',
  'custom-server',
  'data-fetch',
  'dynamic-routing',
  'environment-variables',
  'fast-refresh-demo',
  'gh-pages',
  'head-elements',
  'headers',
  'hello-world',
  'i18n-routing',
  'image-component',
  'layout-component',
  'nested-components',
  'progressive-render',
  'progressive-web-app',
  'redirects',
  'rewrites',
  'ssr-caching',
  'styled-jsx-with-csp',
  'svg-components',
  'using-preact',
  'using-router',
  'with-absolute-imports',
  'with-algolia-react-instantsearch',
  'with-ant-design-less',
  'with-ant-design-mobile',
  'with-ant-design-pro-layout-less',
  'with-ant-design',
  'with-aphrodite',
  'with-apollo-and-redux',
  'with-apollo-neo4j-graphql',
  'with-apollo',
  'with-app-layout',
  'with-astroturf',
  'with-atlaskit',
  'with-aws-amplify-typescript',
  'with-aws-amplify',
  'with-babel-macros',
  'with-carbon-components',
  'with-cerebral',
  'with-chakra-ui-typescript',
  'with-chakra-ui',
  'with-compiled-css',
  'with-context-api',
  'with-cookie-auth-fauna',
  'with-cookie-auth',
  'with-cssed',
  'with-custom-babel-config',
  'with-custom-reverse-proxy',
  'with-cxs',
  'with-deta-base',
  'with-docker',
  'with-dotenv',
  'with-draft-js',
  'with-dynamic-app-layout',
  'with-dynamic-import',
  'with-electron-typescript',
  'with-electron',
  'with-emotion-vanilla',
  'with-emotion',
  'with-env-from-next-config-js',
  'with-expo-typescript',
  'with-expo',
  'with-facebook-pixel',
  'with-fela',
  'with-filbert',
  'with-firebase-authentication-serverless',
  'with-firebase-authentication',
  'with-firebase-cloud-messaging',
  'with-firebase-hosting',
  'with-firebase',
  'with-flow',
  'with-framer-motion',
  'with-glamor',
  'with-glamorous',
  'with-global-stylesheet-simple',
  'with-global-stylesheet',
  'with-goober',
  'with-google-analytics-amp',
  'with-google-analytics',
  'with-google-tag-manager',
  'with-graphql-faunadb',
  'with-graphql-hooks',
  'with-graphql-react',
  'with-grommet',
  'with-gsap',
  'with-hls-js',
  'with-http2',
  'with-i18n-rosetta',
  'with-ionic-typescript',
  'with-iron-session',
  'with-jest',
  'with-kea',
  'with-knex',
  'with-linaria',
  'with-lingui',
  'with-loading',
  'with-magic',
  'with-markdown',
  'with-material-ui',
  'with-mdbreact',
  'with-mdx-remote',
  'with-mdx',
  'with-mobx-react-lite',
  'with-mobx-state-tree-typescript',
  'with-mobx-state-tree',
  'with-mobx',
  'with-mocha',
  'with-monaco-editor',
  'with-mongodb-mongoose',
  'with-mongodb',
  'with-mqtt-js',
  'with-msw',
  'with-mux-video',
  'with-mysql',
  'with-neo4j',
  'with-netlify-cms',
  'with-next-auth',
  'with-next-css',
  'with-next-i18next',
  'with-next-less',
  'with-next-offline',
  'with-next-page-transitions',
  'with-next-routes',
  'with-next-sass',
  'with-next-seo',
  'with-next-sitemap',
  'with-next-translate',
  'with-nhost-auth-realtime-graphql',
  'with-now-env',
  'with-orbit-components',
  'with-overmind',
  'with-passport-and-next-connect',
  'with-passport',
  'with-paste-typescript',
  'with-patternfly',
  'with-polyfills',
  'with-portals-ssr',
  'with-portals',
  'with-prefetching',
  'with-pretty-url-routing',
  'with-prisma',
  'with-quill-js',
  'with-rbx-bulma-pro',
  'with-react-bootstrap',
  'with-react-ga',
  'with-react-helmet',
  'with-react-intl',
  'with-react-jss',
  'with-react-md-typescript',
  'with-react-md',
  'with-react-multi-carousel',
  'with-react-native-web',
  'with-react-relay-network-modern',
  'with-react-toolbox',
  'with-react-with-styles',
  'with-reactstrap',
  'with-realm-web',
  'with-reason-relay',
  'with-reasonml-todo',
  'with-reasonml',
  'with-rebass',
  'with-recoil',
  'with-redis',
  'with-redux-code-splitting',
  'with-redux-observable',
  'with-redux-persist',
  'with-redux-saga',
  'with-redux-thunk',
  'with-redux-toolkit',
  'with-redux-wrapper',
  'with-redux',
  'with-reflux',
  'with-relay-modern',
  'with-rematch',
  'with-route-as-modal',
  'with-segment-analytics',
  'with-semantic-ui',
  'with-sentry-simple',
  'with-sentry',
  'with-service-worker',
  'with-shallow-routing',
  'with-sitemap',
  'with-slate',
  'with-static-export',
  'with-stencil',
  'with-stitches',
  'with-stomp',
  'with-storybook-styled-jsx-scss',
  'with-storybook',
  'with-strict-csp-hash',
  'with-strict-csp',
  'with-stripe-typescript',
  'with-style-sheet',
  'with-styled-components-rtl',
  'with-styled-components',
  'with-styled-jsx-plugins',
  'with-styled-jsx-postcss',
  'with-styled-jsx-scss',
  'with-styled-jsx',
  'with-styletron',
  'with-supabase-auth-realtime-db',
  'with-supertokens',
  'with-sw-precache',
  'with-tailwindcss-emotion',
  'with-tailwindcss',
  'with-tesfy',
  'with-three-js',
  'with-typescript-eslint-jest',
  'with-typescript-graphql',
  'with-typescript-styled-components',
  'with-typescript-types',
  'with-typescript',
  'with-typestyle',
  'with-universal-configuration-build-time',
  'with-universal-configuration-runtime',
  'with-unsplash',
  'with-unstated',
  'with-urql',
  'with-userbase',
  'with-vercel-fetch',
  'with-videojs',
  'with-web-worker',
  'with-webassembly',
  'with-webpack-bundle-analyzer',
  'with-webpack-bundle-size-analyzer',
  'with-why-did-you-render',
  'with-xstate',
  'with-yarn-workspaces',
  'with-zones',
  'with-zustand',
]

describe('NextJS example apps', () => {
  let cwd: string

  beforeAll(async () => {
    cwd = await getWorkingDir(
      'nextjs-example-apps-test',
      Boolean(process.env.FAB_E2E_CLEAN)
    )

    await shellac.in(cwd)`
    $$ git clone https://github.com/vercel/next.js.git --depth 1 --single-branch --branch=canary
    `
  })

  it.each(exampleApps)('Test %p', async (app) => {
    const appPath = path.join(cwd, `${app}-app`)

    // Create app.
    await shellac.in(cwd)`
    $ yarn add create-next-app
    $ yarn create-next-app --example-path ./next.js/examples/${app} ${app}-app
    `

    // Make sure that target is always serverless.
    if (await fs.pathExists(path.join(appPath, 'next.config.js'))) {
      await fs.appendFile(
        path.join(appPath, 'next.config.js'),
        "module.exports.target = 'serverless'"
      )
    }

    // Set up FAB config.
    await shellac.in(appPath)`
    $ npx fab init -y
    stdout >> ${(lastCmdOut) => {
      expect(lastCmdOut).toMatch(/💎 All good 💎/)
    }}
    `

    // Build NextJS. If it fails here, it's an issue in NextJS.
    // Call directly instead of using yarn to capture stdout of build.
    await shellac.in(appPath)`
    $ ./node_modules/.bin/next build
    stdout >> ${(lastCmdOut) => {
      expect(lastCmdOut).toMatch(/server-side renders at runtime/)
    }}
    `

    // NextJS builds, but FAB fails? Please submit an issue.
    // Call directly instead of using yarn to capture stdout of build.
    await shellac.in(appPath)`
    $ ./node_modules/.bin/fab build
    stdout >> ${(lastCmdOut) => {
      expect(lastCmdOut).toMatch(/\[Generator] Created fab\.zip/)
    }}
    `

    await fs.remove(appPath)
  })

  afterAll(() => {
    fs.remove(path.join(cwd, 'next.js'))
  })
})
