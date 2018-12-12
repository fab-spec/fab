const fs = require('fs-extra')
const path = require('path')

export default async function rewriteWebpackEmptyContext(
  server_js_path: string
) {
  const bundle = await fs.readFile(server_js_path, 'utf8')
  const replaced =
    // NFI why this is broken atm
    // `var setTimeout = global.setTimeout;\n` +
    // NextJS uses dynamic requires, we've prepared a
    // NEXT_CACHE to catch them so wire them together.
    bundle.replace(
      'function webpackEmptyContext(req) {',
      (match: string) => `${match}
      if (typeof NEXT_CACHE !== 'undefined') {
        if (NEXT_CACHE[req]) return NEXT_CACHE[req]
      }
    `
    )
  await fs.writeFile(server_js_path, replaced, 'utf8')
}
