export default {
  title: 'FAB — Frontend Application Bundles',
  description: 'Project homepage for the FAB specification & related tooling',
  src: '../',
  files: '{docs/*.mdx,packages/*/README.md}',
  themeConfig: {
    styles: {
      body: {
        'font-variant-ligatures': 'common-ligatures'
      }
    },
    linesToScrollEditor: 999999,
    showPlaygroundEditor: false,
    codeSandbox: false
  }
}
