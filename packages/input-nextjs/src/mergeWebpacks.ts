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

// @ts-ignore
import { parseScript } from 'shift-parser'
// @ts-ignore
import codegen, { FormattedCodeGen } from 'shift-codegen'
import assert from 'assert'

type ExtractedInfo = {
  [path: string]: {
    entry_point: string
    webpack_modules: any[]
  }
}

export const mergeWebpacks = (files: { [path: string]: string }) => {
  const extracted_info: ExtractedInfo = {}
  let first_ast: any
  const path_keys = Object.keys(files)

  for (const path of path_keys) {
    const ast = parseScript(files[path])

    // Expect module.exports = ((...) => { ... entry_point }, { ... webpack contents ... })
    assert(ast.statements.length === 1)

    const module_exports_equals = ast.statements[0].expression
    assert(module_exports_equals.type === 'AssignmentExpression')
    assert(module_exports_equals.binding.object.name === 'module')
    assert(module_exports_equals.binding.property === 'exports')

    const iife = module_exports_equals.expression
    assert(iife.type === 'CallExpression')
    assert(iife.callee.params.items.length === 1)
    assert(iife.arguments.length === 1)
    assert(iife.arguments[0].type === 'ObjectExpression')

    const preamble = iife.callee.body.statements

    // Weirdly, the format here is:
    //   return __webpack_require__(__webpack_require__.s = "C7Cc");
    const ret_exp = preamble[preamble.length - 1]
    assert(ret_exp.type === 'ReturnStatement')
    assert(ret_exp.expression.type === 'CallExpression')
    assert(ret_exp.expression.callee.name === '__webpack_require__')
    assert(ret_exp.expression.arguments.length === 1)

    const webpack_s_assignment = ret_exp.expression.arguments[0]
    assert(webpack_s_assignment.type === 'AssignmentExpression')
    assert(webpack_s_assignment.expression.type === 'LiteralStringExpression')

    const entry_point = webpack_s_assignment.expression.value
    const webpack_content = iife.arguments[0]

    extracted_info[path] = { entry_point, webpack_modules: webpack_content.properties }

    if (!first_ast) first_ast = { ast, ret_exp, webpack_content }
  }

  const { ast, ret_exp, webpack_content } = first_ast

  // We need an AST structure to graft the entry points together
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
  // console.log(entry_point_object_src)

  const entry_point_replacement = parseScript(entry_point_object_src)
  ret_exp.expression = entry_point_replacement.statements[0].expression.arguments[0]

  const seen_keys = new Set()
  webpack_content.properties = []

  path_keys.forEach((path) => {
    const { webpack_modules } = extracted_info[path]

    webpack_modules.forEach((module) => {
      if (seen_keys.has(module.name.value)) return

      seen_keys.add(module.name.value)
      webpack_content.properties.push(module)
    })
  })

  return codegen(ast, new FormattedCodeGen())
}
