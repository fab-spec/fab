---
name: "@fab/compile"
route: "/packages/@fab/compile"
menu: Packages
---

## `@fab/compile`

```
yarn global add @fab/compile
npm install -g @fab/compile
```

```
fab-compile
  -i, --input=input          [default: .fab/intermediate] Intermediate FAB directory
  -b, --build-dir=build-dir  [default: .fab/build] Working FAB directory
  -o, --output=output        [default: fab.zip] Output FAB file
```

### FAB Intermediate Directory

`@fab/compile` operates on an "intermediate directory", by default located at `.fab/intermediate`, consisting of the following:

```
.fab/intermediate
  ├── _server
  │   ├──index.js       (server entry point)
  │   ├──production-settings.json
  │   └── **            (any other files needed for compilation)
  ├── _assets           (directory of assets for this release)
      └── **            (all files passed through untouched)
  └── **/*              (any other assets handled as "public")
```

### `_assets` vs public assets

Any file that's not in `_server` or `_assets` will be treated as a "public asset". During compilation, these files are fingerprinted and copied into the FAB under the `_assets/_public` directory, and server code is injected to map the old paths to the new ones:

```js
// .fab/intermediate/some-dir/some-file.xyz
//             copied to:
// .fab/build/_assets/_public/some-dir/some-file.a7b29c34fd.xyz

const render = async (request, settings) => {
  if (pathMatches(request, '/some-dir/some-file.xyz')) {
    // Fetch the asset using its /_assets/_public URL
    const response = await fetch(`https://your.app/_assets/_public/some-dir/some-file.a7b29c34fd.xyz`)
    // Delete its cache control header, since only _assets 
    // are safe to cache forever
    response.headers.delete('cache-control')
    // Pass through the response
    return response
  }
  
  // For all other requests, forward them to your app as expected
  return your_app.render(request, settings)
}
```

This has a nice consequence—_any_ static asset file structure can be compiled to a FAB, but those that make proper use of the `_asset` directory will have far better performance and caching behaviour.

### `_server/index.js` and `_server/production-settings.json`

These two files get compiled together to produce the two exports for a FAB's `server.js` file: `render` and `getProdSettings`. This process is done using a minimal Webpack configuration, so `require`-ing other files (potentially generated ones) is supported, but more complex source transformations (like using Babel) are not. If needed, pre-compile your source code before placing it in `.fab/intermediate`.
