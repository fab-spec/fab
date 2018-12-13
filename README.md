# Frontend Application Bundle (FAB) Specification

***extremely work-in-progress voice*** This is extremely work-in-progress, under active development by [@glenmaddern](https://twitter.com/glenmaddern). Skip ahead to the [Development Progress](#development-progress) section to see what's good to use right now.

## The FAB format

### Frontend Applications

The term _**Frontend Application**_ encompasses a wide range of modern web projects, from purely static sites with no client-side JS, to entirely client-rendered apps hitting an API, or those with a significant server-side-rendering component. But they are defined in opposition to a more traditional "backend" application, which may emit HTML across the wire as well, but usually has a persistent server, with direct connections to databases and a local filesystem.

This is synonymous with some of the more common web app development methodologies in the React/Angular/Vue/Ember ecosystems—a self-contained single-page-app, potentially pre-rendered or server-rendered, talking to a separate backend app or collection of services via HTTP.

### Why a new bundle format?

The _**Frontend Application Bundle**_ is designed to fill a gap between existing options for frontend application deployment and hosting environments. Usually, you have a choice between a static site host, which prevents you from having any active server-side components, or a more traditional web app host designed for hosting backends.

And while deploying frontend apps to backend-centric hosts works reasonably well, it misses a crucial aspect of frontend web development—_iteration speed_. UI development benefits greatly from rapid prototyping and feedback, and since frontend apps, having no direct dependencies on databases or filesystems, can be cloned & deployed freely, backend-centric workflows can feel overly constrained.

As such, static site hosting has grown in popularity among the frontend application community, and static site generators along with them. But there are many reasons why it's preferable or even essential to include a server-side component in your application, which these projects can't take advantage of without fundamentally changing how they build & deliver their app.

_**Frontend Application Bundles**_ are the container format that work equally well for fully-static through to full server-rendered frontend apps, making your choice of _technology_ independent from your choice of _hosting_.

### `fab.zip` specification

The FAB file is a zip* file containing two parts:

```
fab.zip
  ├── server.js   (server entry point)
  └── _assets     (directory of assets for this release)
```

> _It is desirable, but not required, to use [`deterministic-zip`](https://npm.im/deterministic-zip) to create this file. This will ensure that two FABs with identical contents will themselves be identical._ 

### `server.js`

A `V8:Isolate`-compatible single-file build of your server-side logic.

Exposes two entry points:

```js
const getProdSettings = () => {
  return {
    // All production settings are bundled into the FAB here,
    // ensuring predictable behaviour regardless of host.
    // These are returned as a separate entry point, however,
    // so that any encrypted variables can be decrypted
    // by the host before being passed through to the render.
  }
}

const render = async (request, settings) => {
  // request: a fetch.Request object
  // settings: your production settings plus any
  //           environment-specific overrides
  
  const { body, statusCode, headers } = 
                  await myApp.render(request, settings)
  
  // return a fetch.Response object with the full data.
  // Streaming responses not yet fully supported, but will be.
  return new Response(body, { statusCode, headers })
}

module.exports = { render, getProdSettings }
```

### `_assets` directory

Intended to be extracted from the FAB and hosted separately on a static file server like S3, then routed there by a CDN or load balancer using the URL path `/_assets/*`. This usually happens _in front_ of your FAB host, and assets are recommended to be served with `cache-control: immutable` headers. As such, files in this directory _must_ be fingerprinted so they do not clash from release to release.

Since there can be no static assets _outside_ the `/_assets` directory, and all assets must be fingerprinted, we provide `@fab/compile` which takes a more user-friendly format and generates a spec-compliant FAB.

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

## Development Progress

```
@fab/compile - advanced compiler for SSR FABs         WORKING
@fab/serve - host a FAB in a NodeJS express server    WORKING
@fab/afterjs - compile an After.js project            WORKING
@fab/next - compile a NextJS project                  ALPHA RELEASE
@fab/static - compile a FAB from a static dir         UNDER DEVELOPMENT
@fab/cf-workers - wrap FAB in a Cloudflare Worker     PLANNED
@fab/docker - wrap FAB in a Docker image              PLANNED
```

Please star this project to follow along!

---

@glenmaddern.