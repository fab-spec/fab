---
title: 'Server Component Restrictions'
category: Knowledge Base
position: 310
---

# FAB Server Component Restrictions

A FAB server component is a single JS file that is compiled using [Rollup](https://github.com/fab-spec/fab/blob/master/packages/actions/src/rollup.ts) from your chain of [plugins](/kb/plugins), and executes in a `V8::Isolate` container. This places some significant restrictions on both what can be _compiled_ and _executed_ safely.

## Compile-time considerations

Firstly, some background. Server-side JavaScript has been pretty much synonymous with NodeJS for its entire history (Node, after all, effectively invented the concept). As a result, many of the most popular server-side JavaScript _packages_ have many ingrained assumptions about _running in a full NodeJS environment_, for example:

* Access to `fs` module for reading files off the filesystem, or creating new ones
* Direct access to `http` for opening servers or making requests
* Calling `require` programmatically
* Using `eval`

Due to FABs' run-time restrictions (see below), these need to be excluded or shimmed at compile time to make things work. This is an area of ongoing work, but the first positive confirmation that this approach bears fruit is in [`@fab/input-nextjs`](https://github.com/fab-spec/fab/tree/master/packages/input-nextjs).

The current plan is to generalise that code to create a `@fab/precompile` package that can handle these kinds of considerations in a single, shared place, once the focus of the FAB project expands to support more [custom SSR configurations](/guides/converting-custom-ssr).

## Runtime consideration

As mentioned above, the `server.js` component gets executed in a `V8::Isolate` container. This gives extremely good performance and security,

with the following global variables:

```js
global = {
  fetch: fetch,
  Request: fetch.Request,
  Response: fetch.Response,
  Headers: fetch.Headers,
  URL: URL,
  console: {
    log: console.log,
    error: console.error,
  },
  NODE_ENV: 'server',
  process: {
    env: {
      NODE_ENV: 'server',
    },
  },
  setTimeout,
  setImmediate,
  clearTimeout,
}
```

As a result, any packages that expect NodeJS to be present need to be appropriately shimmed out. This is still a work in progress, thankfully a significant proportion of modern frontend applications are already supported as [one of the known frameworks](https://fab.dev/guides/known-project-types).

## More reading

Since Cloudflare Workers share the same `V8::Isolate` runtime architecture, there is some more information [on their documentation pages](https://developers.cloudflare.com/workers/about/how-it-works/), while we work on improving the information here.
