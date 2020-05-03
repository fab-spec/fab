export default {
  typescript: false,
  title: 'FAB — Frontend Application Bundles',
  description: 'Homepage for the FAB project & specification',
  files: ['./{readmes,kb,guides,api}/*.{md|mdx}'],
  themesDir: './',
  public: 'public/',
  menu: [
    'Home',
    {
      name: 'Guides',
      menu: [
        'Getting Started',
        'Deploying',
        'Adding Server-Side Logic',
        'Giving Feedback',
        'Deploying',
      ],
    },
    //{
    //  name: 'Examples',
    //  menu: ['NextJS on Cloudflare Workers'],
    //},
    {
      name: 'Knowledge Base',
      menu: ['Configuration', 'Plugins', 'Settings'],
    },
  ],
  //gatsbyRemarkPlugins: [
  //  {
  //    resolve: 'gatsby-remark-vscode',
  //    // OPTIONAL
  //    options: {},
  //  },
  //],
}
