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

import { FabFilesObject } from '@fab/core'
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
    console.log(path)
    console.log(entry_point)
    console.log(webpack_modules.map((module: any) => module.key.value))

    if (!first_ast) first_ast = { ast, ret_exp, webpack_content }
  }

  console.log({ extracted_info })

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
      const key = module.key.value
      console.log(key, seen_keys.has(key))
      if (seen_keys.has(key)) return

      seen_keys.add(key)
      webpack_content.properties.push(module)
    })
  })

  console.log(...seen_keys)
  console.log(webpack_content.properties.length)
  console.log(webpack_content.properties.map((module: any) => module.key.value))

  return generate(ast)
}
