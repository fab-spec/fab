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

_* It is desirable, but not required, to use [`deterministic-zip`](https://npm.im/deterministic-zip) to create this file. This will ensure that two FABs with identical contents will themselves be identical. 

### `server.js`

A `V8:Isolate`-compatible single-file build of your server-side logic.

Exposes two entry points:

```js


const render = async (request, settings) => {
  // invoke your application
  return new Reponse(/* respond here */)
}

module.exports = { renderGet }
```

### `settings.json`

Production settings compiled in, to ensure that production changes are _only_ possible by deploying a new FAB.

On each request, a new `settings` object can be injected as required to allow testing the one bundle in multiple environments. This should be merged with the production data object.

### `_assets` directory

Fingerprinted, usually copied to a static host and forked off at the CDN level (all http request for `/_assets*` can be forked off.)

## Development Progress

```
@fab/static - compile a FAB from a static dir         3%
@fab/serve - host a FAB in a NodeJS express server    0%
@fab/next - compile a NextJS project                  0%
@fab/compile - advanced compiler for SSR FABs         0%
@fab/cf-workers - wrap FAB in a Cloudflare Worker     0%
@fab/docker - wrap FAB in a Docker image              0%
```

Please star this project to follow along!

---

@glenmaddern.