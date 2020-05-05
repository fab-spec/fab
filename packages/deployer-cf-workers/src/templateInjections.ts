import { FABServerContext } from '@fab/core'

// language=JavaScript
export default (
  fab_src: string,
  assets_url: string,
  server_context: FABServerContext
) => `
  ${fab_src}; // makes globalThis.__fab
  globalThis.__assets_url = ${JSON.stringify(assets_url)};
  __server_context = ${JSON.stringify(server_context)}
`
