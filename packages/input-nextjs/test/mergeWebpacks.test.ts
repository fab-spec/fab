import { expect } from 'chai'
import { mergeWebpacks } from '../src/mergeWebpacks'
import prettier from 'prettier'

describe('mergeWebpacks', () => {
  it('should parse and merge two webpack files', () => {
    const makeFile = (entry_point: string, content: string) => `
      module.exports = (function(modules) {
        var installedModules = {}
        function __webpack_require__(moduleId) {}
        return ${entry_point}
      })(${content})
    `

    const fileA = makeFile(
      `__webpack_require__((__webpack_require__.s = 'Cq4J'))`,
      `
      {
        'Cq4J': function(module, exports, __webpack_require__) {
          console.log("Do something")
        },
        '+jru': function(module, exports, __webpack_require__) {
          console.log("Do something else")
        }
      }
      `
    )

    const fileB = makeFile(
      `__webpack_require__((__webpack_require__.s = 'C7Cc'))`,
      `
      {
        '+jru': function(module, exports, __webpack_require__) {
          console.log("Do something else")
        },
        'C7Cc': function(module, exports, __webpack_require__) {
          console.log("Do a third thing")
        },
      }
      `
    )

    expect(
      prettier.format(
        mergeWebpacks({
          '/a': fileA,
          '/b': fileB,
        }),
        { parser: 'babel' }
      )
    ).to.eq(
      prettier.format(
        makeFile(
          `{'/a': __webpack_require__('Cq4J'), '/b': __webpack_require__('C7Cc')}`,
          `
      {
        'Cq4J': function(module, exports, __webpack_require__) {
          console.log("Do something")
        },
        '+jru': function(module, exports, __webpack_require__) {
          console.log("Do something else")
        },
        'C7Cc': function(module, exports, __webpack_require__) {
          console.log("Do a third thing")
        },
      }
      `
        )
      )
    )
  })
})
