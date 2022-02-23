export const DEFAULT_DEPS = [
  '@dev-spendesk/cli',
  '@dev-spendesk/server',
  '@dev-spendesk/actions',
]
export const DEPRECATED_PACKAGES = [
  '@dev-spendesk/static',
  '@dev-spendesk/compile',
  '@dev-spendesk/nextjs',
  '@dev-spendesk/serve',
  '@dev-spendesk/serve-html',
  '@dev-spendesk/rewire-assets',
]

export const GITIGNORE_LINES = ['/.fab', '/fab.zip']
export const GUESSED_OUTPUT_DIRS = ['build', 'dist', 'public', 'out']
export const OUTPUT_DIR_EXAMPLES =
  GUESSED_OUTPUT_DIRS.slice(0, GUESSED_OUTPUT_DIRS.length - 1)
    .map((dir) => `💛${dir}💛`)
    .join(', ') + ` or 💛${GUESSED_OUTPUT_DIRS.slice(-1)}💛`

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
    // • See https://fab.dev/guides/deploying for more info.
    // However, we recommend automatic deploys (triggered by git push)
    // using a service such as Linc (https://linc.sh)
    // • See https://fab.dev/kb/automatic-deploys for setup instructions.
  }
}
`
export type StringMap = {
  [key: string]: string
}
export type PackageJson = {
  scripts?: StringMap
  dependencies?: StringMap
  devDependencies?: StringMap
}
