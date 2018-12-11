const fs = require('fs-extra')
const path = require('path')

export default async function rewriteWebpackEmptyContext(server_js_path: string) {
  const bundle = await fs.readFile(
    server_js_path,
    'utf8'
  )
  const replaced = bundle.replace(
    'function webpackEmptyContext(req) {',
    (match: string) => `${match}
      console.log({req})
      if (global.NEXT_CACHE[req]) return global.NEXT_CACHE[req]
    `
  )
  await fs.writeFile(server_js_path, replaced, 'utf8')
}
