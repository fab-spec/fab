export default {
  title: 'FAB — Frontend Application Bundles',
  description: 'Project homepage for the FAB specification & related tooling',
  src: '../',
  files: '{README.md,docs/**/*.mdx,packages/*/README.md}',
  themeConfig: {
    styles: {
      body: {
        fontVariantLigatures: 'common-ligatures'
      },
      h1: {
        fontFamily: 'Source Sans Pro',
        fontSize: [50, 55, 60],
      },
      h2: {
        fontFamily: 'Source Sans Pro',
      },
      h3: {
        fontWeight: 'bold'
      },
      code: {
        whiteSpace: 'nowrap'
      },
    },
    linesToScrollEditor: 999999,
    showPlaygroundEditor: false,
    codeSandbox: false,
    logo: {
      src: 'https://user-images.githubusercontent.com/23264/53997173-49745400-418f-11e9-87d0-60a9da6449e6.png',
      width: '100%'
    }
  }
}
