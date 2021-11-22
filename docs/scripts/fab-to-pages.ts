import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
const __dirname = fileURLToPath(path.dirname(import.meta.url))

// TODO: unpack the zip file
const unpacked_dir = path.resolve(__dirname, '../.fab/build')
const server_js = path.resolve(unpacked_dir, 'server.js')
const assets_dir = path.resolve(unpacked_dir, '_assets')

const must_exist = [unpacked_dir, server_js, assets_dir]
const exists_check = Promise.all(must_exist.map(async (path) => fs.pathExists(path)))

if ((await exists_check).some((x) => x === false)) {
  throw new Error(
    `Missing one of\n  ${must_exist.join(',\n  ')}.\nRerun 'fab build' and retry.`
  )
}

console.log('Hello')
