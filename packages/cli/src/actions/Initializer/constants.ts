import path from 'path'
import fs from 'fs-extra'
import { FabInitError } from '../../errors'
import { log } from '../../helpers'
import { BuildConfig } from '@fab/core'

export type FrameworkInfo = {
  name: string
  plugins: BuildConfig
  scripts: { [name: string]: string }
  customConfig?: (root_dir: string) => void
}
export const DEFAULT_DEPS = ['@fab/cli', '@fab/server']
export const GITIGNORE_LINES = ['/.fab', '/fab.zip']
export const GUESSED_OUTPUT_DIRS = ['build', 'dist', 'public', 'out']
export const OUTPUT_DIR_EXAMPLES =
  GUESSED_OUTPUT_DIRS.slice(0, GUESSED_OUTPUT_DIRS.length - 1)
    .map((dir) => `💛${dir}💛`)
    .join(', ') + ` or 💛${GUESSED_OUTPUT_DIRS.slice(-1)}💛`

export const Frameworks = {
  CreateReactApp: (): FrameworkInfo => ({
    name: 'Create React App',
    scripts: {
      'build:fab': 'npm run build && npm run fab:build',
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      '@fab/input-static': {
        dir: 'build',
      },
      '@fab/serve-html': {
        fallback: '/index.html',
      },
      '@fab/rewire-assets': {},
    },
  }),
  Gatsby: (): FrameworkInfo => ({
    name: 'Gatbsy JS',
    scripts: {
      'build:fab': 'npm run build && npm run fab:build',
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      '@fab/input-static': {
        dir: 'public',
      },
      '@fab/serve-html': {
        fallback: false,
      },
      '@fab/rewire-assets': {},
    },
  }),
  Next9: ({
    export_build,
    build_cmd,
  }: {
    export_build: boolean
    build_cmd: string
  }): FrameworkInfo => ({
    name: `NextJS v9+ (${export_build ? 'static' : 'dynamic'})`,
    scripts: {
      'build:fab': `${build_cmd} && npm run fab:build`,
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      ...(export_build
        ? {
            '@fab/input-static': {
              dir: 'out',
            },
            '@fab/serve-html': {
              fallback: '/index.html',
            },
          }
        : {
            '@fab/input-nextjs': {
              dir: '.next',
            },
            '@fab/serve-html': {
              fallback: false,
            },
          }),
      '@fab/rewire-assets': {},
    },
    async customConfig(root_dir: string) {
      if (export_build) return
      const config_path = path.join(root_dir, 'next.config.js')
      if (await fs.pathExists(config_path)) {
        const next_config = require(config_path)
        if (next_config.target !== 'serverless') {
          log(
            `❤️WARNING: Your NextJS project is not currently configured for a serverless build.❤️
            ${
              next_config.target
                ? `Add 💛target: 'serverless'💛 to your 💛next.config.js💛 file.`
                : `Currently your app is configured to build in 💛${next_config.target ||
                    'server'}💛 mode.
                Update this in your 💛next.config.js💛 by setting 💛target: 'serverless'💛`
            }
            Continuing setup, but ❤️fab build will fail❤️ until this is changed.`
          )
        } else {
          log(`Your app is already configured for a severless build. Proceeding.`)
        }
      } else {
        log(`No 💛next.config.js💛 found, adding one to set 💛target: 'serverless'💛`)
        await fs.writeFile(config_path, `module.exports = {\n  target: 'serverless'\n}\n`)
      }
    },
  }),
}
export const GenericStatic = (
  build_cmd: string,
  found_output_dir: string
): FrameworkInfo => ({
  name: 'Static Site',
  scripts: {
    'build:fab': `${build_cmd} && npm run fab:build`,
    'fab:build': 'fab build',
    'fab:serve': 'fab serve fab.zip',
  },
  plugins: {
    '@fab/input-static': {
      dir: found_output_dir,
    },
    '@fab/serve-html': {
      fallback: '/index.html',
    },
    '@fab/rewire-assets': {},
  },
})

export const FRAMEWORK_NAMES = Object.keys(Frameworks)

export const BASE_CONFIG: string = `// For more information, see https://fab.dev/kb/configuration
{
  plugins: {
    // This section defines your build & runtime toolchains. See https://fab.dev/kb/plugins
  },
  settings: {
    // This section defines the variables that are injected, depending on environment.
    // See https://fab.dev/kb/settings for more info.
    production: {
      // This environment is special. These variables get compiled into the FAB itself,
      // allowing for many production-specific optimisations. See https://fab.dev/kb/production
      // Example setting:
      // API_URL: 'https://api.example.com/graphql'
    },
  },
  deploy: {
    // For manual (command-line) deploys, add configuration here.
    // • See https://fab.dev/kb/deploying for more info.
    // For automatic deploys (triggered by git push), we recommend using Linc:
    // • See https://linc.sh/docs/automatic-deploys for setup instructions.
  }
}
`
type StringMap = {
  [key: string]: string
}
export type PackageJson = {
  scripts?: StringMap
  dependencies?: StringMap
  devDependencies?: StringMap
}
