import { DEFAULT_MIME_TYPE, IMMUTABLE_HEADERS, NON_IMMUTABLE_HEADERS } from './constants'
import mime from 'mime-types'

export function filenameOutsideFabLocations(filename: string) {
  return filename !== '/server.js' && !filename.startsWith('/_assets/')
}

export function getContentType(pathname: string) {
  const mimeType = mime.lookup(pathname)
  return (mimeType && mime.contentType(mimeType)) || DEFAULT_MIME_TYPE
}

export function getCacheHeaders(immutable: boolean) {
  return immutable ? IMMUTABLE_HEADERS : NON_IMMUTABLE_HEADERS
}

export function matchPath<T>(
  lookup_table: { [pathname: string]: T },
  pathname: string
): T | undefined {
  return (
    lookup_table[pathname] ||
    lookup_table[pathname + '.html'] ||
    lookup_table[`${pathname}${pathname.endsWith('/') ? '' : '/'}index.html`]
  )
}
