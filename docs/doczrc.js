export default {
  typescript: false,
  title: 'FAB — Frontend Application Bundles',
  description: 'Homepage for the FAB project & specification',
  files: ['./{readmes,kb,guides}/*.{md|mdx}'],
  themesDir: './',
  public: 'public/',
  themeConfig: {
    colors: { sidebar: { bg: '#EEF1F5' } },
    styles: {
      body: {
        fontVariantLigatures: 'common-ligatures',
        background: 'green', //'#fefefe',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";',
      },
      // h1: {
      //   fontSize: [40, 45, 50],
      //   marginTop: '3rem',
      //   marginBottom: '2rem',
      //   letterSpacing: '-0.02em',
      // },
      // h2: {
      //   fontWeight: 'bold',
      // },
      // h3: {
      //   fontWeight: 'bold',
      // },
      code: {
        whiteSpace: 'nowrap',
      },
      p: {
        fontSize: [16, 18, 18],
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";',
      },
    },
    space: [0, 4, 8, 16, 32, 48, 64, 80, 100],
    fonts: {
      monospace: 'Operator Mono SSm, Inconsolata',
      body:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";',
    },
    linesToScrollEditor: 999999,
    showPlaygroundEditor: false,
    codeSandbox: false,
  },
}
