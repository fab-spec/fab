/* This file takes a bunch of extremely similar webpack outputs and merges them,
 * so that files like a.js and b/c.js end up producing a resulting export of:
 *
 *   {
 *     '/a': __webpack_require__('Cq4J'),
 *     '/b/c': __webpack_require__('C7Cc')
 *   }
 *
 * where 'Cq4J' and 'C7Cc' are the default exports of those two files respectively.
 * */

import { FabFilesObject } from '@dev-spendesk/fab-core'
import * as acorn from 'acorn'
import assert from 'assert'
// @ts-ignore
import { generate } from 'astring'

type ExtractedInfo = {
  [path: string]: {
    entry_point: string
    webpack_modules: any[]
  }
}

export const mergeWebpacks = (files: FabFilesObject) => {
  const extracted_info: ExtractedInfo = {}
  let first_ast: any
  const path_keys = Object.keys(files)

  for (const path of path_keys) {
    const ast = acorn.parse(files[path])

    // Expect module.exports = ((...) => { ... entry_point }, { ... webpack contents ... })
    // @ts-ignore
    assert(ast.body.length === 1)

    // @ts-ignore
    const module_exports_equals = ast.body[0].expression
    assert(module_exports_equals.type === 'AssignmentExpression')
    assert(module_exports_equals.left.object.name === 'module')
    assert(module_exports_equals.left.property.name === 'exports')

    const iife = module_exports_equals.right
    assert(iife.type === 'CallExpression')
    assert(iife.callee.params.length === 1)
    assert(iife.arguments.length === 1)
    assert(iife.arguments[0].type === 'ObjectExpression')

    const preamble = iife.callee.body.body

    // Weirdly, the format here is:
    //   return __webpack_require__(__webpack_require__.s = "C7Cc");
    const ret_exp = preamble[preamble.length - 1]
    assert(ret_exp.type === 'ReturnStatement')
    assert(ret_exp.argument.type === 'CallExpression')
    assert(ret_exp.argument.callee.name === '__webpack_require__')
    assert(ret_exp.argument.arguments.length === 1)

    const webpack_s_assignment2 = ret_exp.argument.arguments[0]
    assert(webpack_s_assignment2.type === 'AssignmentExpression')
    assert(webpack_s_assignment2.right.type === 'Literal')

    const entry_point = webpack_s_assignment2.right.value
    const webpack_content = iife.arguments[0]

    const webpack_modules = webpack_content.properties
    extracted_info[path] = { entry_point, webpack_modules }

    if (!first_ast) first_ast = { ast, ret_exp, webpack_content }
  }

  const { ast, ret_exp, webpack_content } = first_ast
  //
  // // We need an AST structure to graft the entry points together
  const entry_point_object_src = `
    call_expr({
      ${path_keys
        .map(
          (path) =>
            `"${path}": __webpack_require__('${extracted_info[path].entry_point}')`
        )
        .join(',\n  ')}
    })
  `

  const entry_point_replacement = acorn.parse(entry_point_object_src)
  // @ts-ignore
  ret_exp.argument = entry_point_replacement.body[0].expression.arguments[0]

  const seen_keys = new Set()
  webpack_content.properties = []

  path_keys.forEach((path) => {
    const { webpack_modules } = extracted_info[path]

    webpack_modules.forEach((module) => {
      const module_key =
        module.key.type === 'Literal' ? module.key.value : module.key.name
      if (seen_keys.has(module_key)) return
      sanitise(module)

      webpack_content.properties.push(module)
      seen_keys.add(module_key)
    })
  })

  return generate(ast)
}

/* There's a couple of things in Next that aren't compatible with FABs,
 * this is where we reach in and snip them out. */
function sanitise(module: any) {
  const str_contents = generate(module.value.body)
  if (removeNodeFetch(str_contents, module)) return
  if (removeEval(str_contents, module)) return
}

/* If the NextJS server-side code uses node-fetch in some way, the FAB
 * will explode (since that hard-codes to the low-level HTTP methods
 * that aren't available in a FAB). This replaces any module that looks
 * like it's trying to stub out `fetch`, with `globalThis.fetch` */
function removeNodeFetch(str_contents: string, module: any) {
  if (str_contents.match(/module.exports = exports = fetch;/)) {
    const replacement_str = `module.exports = exports = globalThis.fetch`
    const replacement_ast = acorn.parse(replacement_str)
    // @ts-ignore
    module.value.body.body = [replacement_ast.body[0]]
    return true
  }
  return false
}

/* Something internal to NodeJS uses wrapfunction as a utility
 * to mark functions as deprecated, then using eval to execute
 * the original function. We inject an early return to avoid
 * actually invoking the eval. */
function removeEval(str_contents: string, module: any) {
  if (str_contents.match(/function\s+wrapfunction/)) {
    const replacement_str = str_contents.replace(
      /function\s+wrapfunction\s*\(([\w_]+)([, \w_]*)\)\s*{/gm,
      'function wrapfunction ($1$2) {\nreturn $1;'
    )
    const replacement_ast = acorn.parse(replacement_str)
    // @ts-ignore
    module.value.body.body = [replacement_ast.body[0]]
    return true
  }
  return false
}
