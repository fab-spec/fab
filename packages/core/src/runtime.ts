/*
 * @fab/core/runtime: SHARED HELPERS FOR FAB RUNTIME MODULES
 *
 * Be careful what you import here, everything needs to be Rollup-compatible
 * and runnable inside a FAB
 * */

import { IMMUTABLE_HEADERS, NON_IMMUTABLE_HEADERS } from './constants'

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
