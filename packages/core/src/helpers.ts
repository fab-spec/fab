import { DEFAULT_MIME_TYPE, IMMUTABLE_HEADERS, NON_IMMUTABLE_HEADERS } from './constants'

export async function a_sume<T>(fn: () => Promise<T>, throws: (e: Error) => Error) {
  try {
    return await fn()
  } catch (e) {
    throw throws(e)
  }
}

export function s_sume<T>(fn: () => T, throws: (e: Error) => Error) {
  try {
    return fn()
  } catch (e) {
    throw throws(e)
  }
}

export function filenameOutsideFabLocations(filename: string) {
  return filename !== '/server.js' && !filename.startsWith('/_assets/')
}

export function getContentType(pathname: string) {
  // Dynamic require because this code bloats FABs if it's a static import.
  // TODO: figure out a better solution
  const mime = require('mime-types')
  const mimeType = mime.lookup(pathname)
  return (mimeType && mime.contentType(mimeType)) || DEFAULT_MIME_TYPE
}

export function getCacheHeaders(immutable: boolean) {
  return immutable ? IMMUTABLE_HEADERS : NON_IMMUTABLE_HEADERS
}

export function matchPath<T>(
  lookup_table: { [pathname: string]: T },
  _pathname: string
): T | undefined {
  const pathname = decodeURIComponent(_pathname)
  return (
    lookup_table[pathname] ||
    lookup_table[pathname + '.html'] ||
    lookup_table[`${pathname}${pathname.endsWith('/') ? '' : '/'}index.html`]
  )
}

export const stripTrailingSlash = (str: string) => str.replace(/\/$/, '')
