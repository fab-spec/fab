import { expect } from 'chai'
import { mergeWebpacks } from '../src/mergeWebpacks'

describe('mergeWebpacks', () => {
  it('should parse and merge two webpack files', () => {
    expect(true).to.be(false)
    const makeFile = (entry_point: string, content: string) => `
      module.exports = (function(modules) {
        // webpackBootstrap
        // The module cache
        var installedModules = {}

        // The require function
        function __webpack_require__(moduleId) {}

        // Load entry module and return exports
        return __webpack_require__((__webpack_require__.s = '${entry_point}'))
      })(${content})
    `

    const fileA = makeFile(
      'Cq4J',
      `
      {
        'Cq4J': function(module, exports, __webpack_require__) {
          // Do something
        },
        '+jru': function(module, exports, __webpack_require__) {
          // Do something else.
        }
      }
      `
    )

    const fileB = makeFile(
      'C7Cc',
      `
      {
        '+jru': function(module, exports, __webpack_require__) {
          // Do something else.
        },
        'C7Cc': function(module, exports, __webpack_require__) {
          // Do a third thing
        },
      }
      `
    )

    console.log(
      mergeWebpacks({
        '/a': fileA,
        '/b': fileB,
      })
    )
  })
})
