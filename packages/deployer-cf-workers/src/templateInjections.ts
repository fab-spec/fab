// language=JavaScript
export default (fab_src: string, assets_url: string) => `
  ${fab_src}; // makes globalThis.__fab
  globalThis.__assets_url = ${JSON.stringify(assets_url)};
`
