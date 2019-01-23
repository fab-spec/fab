import * as expect from 'expect'
import * as fs from 'fs-extra'
import * as prettier from 'prettier'

import Compiler from '../src/Compiler'

const html = (a: string) => prettier.format(a, { parser: 'html' })

describe('hello', () => {
  it('should compile a simple HTML file', async () => {
    const result = await Compiler.compile(__dirname + '/templates/a.in.html')
    const expected = await fs.readFile(__dirname + '/templates/a.out.html', 'utf8')
    expect(html(result)).toEqual(html(expected))
  })
})
