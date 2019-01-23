import * as expect from 'expect'
import * as fs from 'fs-extra'

import Compiler from '../src/Compiler'

describe('hello', () => {
  it('should compile a simple HTML file', async () => {
    const input_file = __dirname + '/templates/a.in.html';
    const result = await Compiler.compile(input_file)

    expect(result).toEqual(await fs.readFile(input_file, 'utf8'))
  })
})
