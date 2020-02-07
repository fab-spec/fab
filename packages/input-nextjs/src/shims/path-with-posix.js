const path = require('path-browserify')

module.exports = Object.create(path, {
  posix: {
    value: path,
  },
})
