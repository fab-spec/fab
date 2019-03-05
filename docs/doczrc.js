export default {
  title: 'FAB — Frontend Application Bundles',
  description: 'Project homepage for the FAB specification & related tooling',
  src: '../',
  files: '{README.md,docs/*.mdx,packages/*/README.md}',
  themeConfig: {
    styles: {
      body: {
        fontVariantLigatures: 'common-ligatures'
      },
      h1: {
        fontFamily: 'Poppins',
        fontSize: [50, 55, 60],
      },
      h3: {
        'font-weight': 'bold'
      }
    },
    linesToScrollEditor: 999999,
    showPlaygroundEditor: false,
    codeSandbox: false,
    logo: {
      src: 'https://user-images.githubusercontent.com/23264/53463084-0b45a900-3a9a-11e9-83b4-e78aca9149d6.png',
      width: '100%'
    }
  }
}
