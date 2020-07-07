# @fab/plugin-precompile

A plugin for pre-compiling plugins using Webpack

## Why?

FAB's [plugins](https://fab.dev/kb/plugins) give you a simple way to add server-side logic to a FAB, but sometimes you have an existing codebase that you'd like to repurpose. As FAB plugins are designed to be written by hand, we've chosen to keep the Rollup config extremely simple and forward-looking (ES modules, Typescript support) without requiring transpilation. But that means anything that expects a NodeJS infrastructure will not work out-of-the-box.

`@fab/plugin-precompile` is designed to give you a flexible Webpack step that isolates your Node code & all the shims away from the modern FAB runtime plugin compiler.

## Usage

```json5
{
  plugins: {
    // ...
    '@fab/plugin-precompile': {
      './your-file.js': {
        // Options, see below
      },
      './another-file.js': {},
    },
    // ...
  },
}
```

This config will set up Webpack compilations with `./your-file.js` and `./another-file.js` as entry points, expecting them to generate a [FAB Runtime Plugin](https://fab.dev/guides/adding-server-side-logic) api.

## Options

Like normal plugins, any key/value pairs you pass through will be available as the second argument to the plugin export:

```json5
{
  plugins: {
    '@fab/plugin-precompile': {
      './your-file.js': {
        key: 'value',
      },
    },
  },
}
```

```js
// your-file.js
export default ({ Router }, args) => {
  // args is {"key":"value"}

  Router.on(/* ... */)
}
```

## Webpack Configuration

There is a special argument `_config`, however, that allows you to specify a file to customise the Webpack build as it runs, in a manner reminiscent of [react-app-rewired](https://github.com/timarney/react-app-rewired#extended-configuration-options):

```json5
{
  plugins: {
    '@fab/plugin-precompile': {
      './your-file.js': {
        _config: './plugin-overrides.js',
      },
    },
  },
}
```

```js
// plugin-overrides.js

// Note, no ES modules here, native NodeJS syntax only
module.exports = {
  // The most common use-case is just adding another shim library
  alias: (existing_aliases) => ({
    ...existing_aliases,
    'some-nodey-module': require.resolve('@some/shim-library'),
  }),
  webpack: (webpack_config) => {
    // You can do anything with the config here, but you must also return it
    webpack_config.plugins.push(new webpack.SomeOtherPlugin(/* ... */))
    return webpack_config
  },
}
```

## Example

Reproduced here from the [the E2E test file `modify-plugin-config.js`](https://github.com/fab-spec/fab/blob/c0decea3e2d8974c76aac67f26838e5995c9664b/tests/e2e/fixtures/server-side-logic/modify-plugin-config.js):

```js
// modify-plugin-config.js
const webpack = require('webpack')

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        replace_me: '"WITH_ME"',
      })
    )
    return config
  },
  alias: (alias) => ({
    ...alias,
    'no-existo': require.resolve('@fab/plugin-precompile/shims/empty-object'),
  }),
}
```

```json5
{
  plugins: {
    '@fab/plugin-precompile': {
      './fab-plugins/needs-webpack.js': {
        _config: './modify-plugin-config.js',
        other_data: 'passed through as normal',
      },
    },
  },
}
```

```js
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
```

```
> curl localhost:3000/webpack-plugin-test
Testing 'fs' shim: FILESYSTEM LOOKS LIKE IT WORKS
Testing 'alias' override: {}
Testing 'webpack' DefinePlugin: {"replace_me":"WITH_ME"}
Testing 'args' wiring up: {"other_data":"passed through as normal"}
```
