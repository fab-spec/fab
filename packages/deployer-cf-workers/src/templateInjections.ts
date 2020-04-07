// language=JavaScript
export default (fab_src: string, assets_url: string) => `
  ${fab_src};

  const INJECTED_ASSETS_URL = ${JSON.stringify(assets_url)};
`
