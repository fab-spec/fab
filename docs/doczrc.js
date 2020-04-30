export default {
  typescript: false,
  title: 'FAB — Frontend Application Bundles',
  description: 'Homepage for the FAB project & specification',
  files: ['./{readmes,kb,guides}/*.{md|mdx}'],
  themesDir: './',
  public: 'public/',
  menu: [
    'Home',
    {
      name: 'Guides',
      menu: ['Getting Started', 'Deploying', 'Giving Feedback', 'Deploying'],
    },
    {
      name: 'Examples',
      menu: ['NextJS on Cloudflare Workers'],
    },
    {
      name: 'Knowledge Base',
      menu: ['Configuration', 'Plugins', 'Settings'],
    },
  ],
  themeConfig: {
    colors: { sidebar: { bg: '#EEF1F5' } },
    styles: {
      body: {
        fontVariantLigatures: 'common-ligatures',
        background: 'green', //'#fefefe',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";',
      },
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
