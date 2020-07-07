import shim from 'no-existo'
import fs from 'fs'

export default ({ Router }, args) => {
  fs.mkdirSync('/tmp')
  const tmpfile = '/tmp/something'
  fs.writeFileSync(tmpfile, 'FILESYSTEM LOOKS LIKE IT WORKS')

  Router.on('/webpack-plugin-test', async () => {
    return new Response(
      [
        `Testing 'fs' shim: ${fs.readFileSync(tmpfile, 'utf8')}`,
        `Testing 'alias' override: ${JSON.stringify(shim)}`,
        `Testing 'webpack' DefinePlugin: ${JSON.stringify({ replace_me: replace_me })}`,
        `Testing 'args' wiring up: ${JSON.stringify(args)}`,
        ``,
      ].join('\n'),
      {
        headers: {
          'content-type': 'text-plain',
        },
      }
    )
  })
}
