import plugin from '../src'
import * as expect from "expect";

describe('Build time', () => {
  it('should be a function', () => {
    expect(typeof(plugin.build)).toBe('function')
    plugin.build()
  })
})
