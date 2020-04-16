import path from 'path'
import fs from 'fs-extra'
import { FabInitError } from '../../errors'
import { log } from '../../helpers'
import { BuildConfig } from '@fab/core'

export enum KnownFrameworkTypes {
  CreateReactApp,
  Next9,
  Gatsby,
}

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

export function STATIC_SITE(build_cmd: string, found_output_dir: string) {
  return {
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
  }
}

export const Frameworks: {
  [key in KnownFrameworkTypes]: FrameworkInfo
} = {
  [KnownFrameworkTypes.CreateReactApp]: {
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
  },
  [KnownFrameworkTypes.Gatsby]: {
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
  },
  [KnownFrameworkTypes.Next9]: {
    name: 'NextJS v9+',
    scripts: {
      // Potentially, we should clear the .next dir before building, to make sure
      // this FAB isn't publishing anything from a previous build.
      'build:fab': 'npm run build && npm run fab:build',
      'fab:build': 'fab build',
      'fab:serve': 'fab serve fab.zip',
    },
    plugins: {
      '@fab/input-nextjs': {
        dir: '.next',
      },
      '@fab/serve-html': {
        fallback: false,
      },
      '@fab/rewire-assets': {},
    },
    async customConfig(root_dir: string) {
      const config_path = path.join(root_dir, 'next.config.js')
      if (await fs.pathExists(config_path)) {
        const next_config = require(config_path)
        if (next_config.target !== 'serverless') {
          throw new FabInitError(
            `Your NextJS project needs to be configured for a serverless build.
            ${
              next_config.target
                ? `Add 💛target: 'serverless'💛 to your 💛next.config.js💛 file.`
                : `Currently your app is configured to build in 💛${next_config.target ||
                    'server'}💛 mode.
                Update this in your 💛next.config.js💛 by setting 💛target: 'serverless'💛`
            }`
          )
        } else {
          log(`Your app is already configured for a severless build. Proceeding.`)
        }
      } else {
        log(`No 💛next.config.js💛 found, adding one to set 💛target: 'serverless'💛`)
        await fs.writeFile(config_path, `module.exports = {\n  target: 'serverless'\n}\n`)
      }
    },
  },
}

export const FRAMEWORK_NAMES = Object.values(Frameworks).map((f) => f.name)

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
