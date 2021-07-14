import { FABServerContext, FabSettings } from '@fab/core'

// language=JavaScript
export default (
  fab_src: string,
  assets_url: string,
  env_overrides: FabSettings,
  server_context: FABServerContext
) => `
  ${fab_src}; // makes globalThis.__fab
  globalThis.__assets_url = ${JSON.stringify(assets_url)};
  globalThis.__server_context = ${JSON.stringify(server_context)};
  globalThis.__env_overrides = ${JSON.stringify(env_overrides)};
`
