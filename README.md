# Frontend Application Bundle (FAB) Specification

***<h3 align="center"><img width="410" alt="fab logo wide" src="https://user-images.githubusercontent.com/23264/53390558-a7fb3e80-39e7-11e9-8b5b-d33640e6514f.png"><br/>Build once, run everywhere</h3>***

<h4>&nbsp;</h4>

FABs are a **compile target for frontend applications**.

They unify **static sites, single page applications (SPAs) as well as server-rendered JavaScript UIs** in one bundle format, allowing instant deployment to a wide range of hosting platforms.

### Framework adapters

> **Note:** for now, you probably want to get started with [**@fab/static**](https://github.com/fab-spec/fab/tree/master/packages/fab-static). It's a zero-config compiler for static sites with hooks to add **as much server-side logic as most apps need**.

Working with one of these projects? Read the following 

* Create React App: [`@fab/static` — Usage with Create React App](https://github.com/fab-spec/fab/tree/master/packages/fab-static)
* Gatsby: [`@fab/static` — Gatsby installations](https://github.com/fab-spec/fab/tree/master/packages/fab-static)
* Any other static site renderer: [`@fab/static` — Usage with many HTML files](https://github.com/fab-spec/fab/tree/master/packages/fab-static)
* NextJS: [`@fab/nextjs`](https://github.com/fab-spec/fab/tree/master/packages/fab-nextjs)
* AfterJS: [`@fab/afterjs`](https://github.com/fab-spec/fab/tree/master/packages/fab-afterjs)

Thinking of writing your own adapter? Head to [https://github.com/fab-spec/fab/tree/master/packages/fab-compile](`@fab/compile`) to understand the low-level compilation API. Then get in touch, we're happy to help!

### Deployment adapters

* Lambda@Edge: [`@fab/lambda-edge-packager`](https://github.com/fab-spec/lambda-edge-packager)
* Cloudflare Workers: [`@fab/cloudflare-workers-packager`](https://github.com/fab-spec/cloudflare-workers-packager)
* NodeJS: [`@fab/serve`](https://github.com/fab-spec/fab/tree/master/packages/fab-serve)

Thinking of writing your own deployment adapter? Read on to understand the runtime requirements of FABs, then check [`@fab/serve`](https://github.com/fab-spec/fab/tree/master/packages/fab-serve) for some sample code.

## The FAB format

> _Note: This is work-in-progress, under active development by [@glenmaddern](https://twitter.com/glenmaddern)._

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

> _All FAB tooling uses [`deterministic-zip`](https://npm.im/deterministic-zip) to create this file, which means that two FABs with identical contents will themselves be identical._ 

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

Extracted from the FAB and hosted separately on a static file server like S3 at deploy time, then routed there by a CDN or load balancer using the URL path `/_assets/*`. This happens _before your request even reaches your FAB_, which means that the `_assets` directory cannot be changed. More importantly, and assets are recommended to be served with `cache-control: immutable` headers. As such, files in this directory _must_ be fingerprinted so they do not clash from release to release.

Since there can be no static assets _outside_ the `/_assets` directory, and all assets must be fingerprinted, we provide `@fab/compile` which takes a more user-friendly format and generates a spec-compliant FAB.

Please star this project to follow along!

---

@glenmaddern.
