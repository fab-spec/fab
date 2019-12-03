FAB modular toolchain design doc

Jotting down some thoughts in order to spec out the overhaul of the FAB tooling that I have in mind. The goal is to make "modules" of distinct, useful functionality, such that `@fab/nextjs` and `@fab/static` and `@fab/rails` can deconstruct into a list of individual modules (some shared).

As far as I can tell, the complexity comes from the fact that a "module" has both build-time and run-time components. Let's start with an example:

## `@fab/perf-webp`

This module would:

* (Optionally) For all `_assets/**/*.{jpg,png}` generate a `webp` version of that image. This would then update the `asset-manifest.json`. This can happen after all the files are moved into the `.fab/build` dir but _before_ the `asset-manifest.json` is compiled into the final `server.js`.
* For any asset request for a JPG/PNG that hits the FAB, check to see if a `.webp` file exists in the asset manifest. If so, return that asset instead.

This raises several questions:

* How does the user/plugin author specify at what point of the build chain to run `@fab/perf-webp`?
* How does the FAB runtime know which plugins to execute, and in which order?
* How does a FAB return a directive to load something from the assets? Returning a string? Or making the request itself?
* How do you opt-in to the package at build time? At run time?

Preliminary thoughts:

* The ordering of plugins ought to be explicit, somewhere, but requiring users to install the plugin _and_ add it to the config seems unnecessary. Maybe a `postinstall` hook? `--ignore-scripts` would mess this up, but I don't think that's that common. Then `preuninstall` could work too. Probably still wanna check that all plugins specified in `fab.json` are installed and bail if not. Also, will `postinstall` run on CI? Will that suddenly add that package into the config? Maybe disable this check on `CI=true`
* This plugin needs access to the filesystem (maybe we should use something in-memory for speed?). An in-memory object that we could then serialise to the filesystem, and read the metadata straight off into the compilation, that might work.
* If this plugin can respond with an asset, then "responding with an asset" could just be a default middleware at the end of the stack, that calls into the FAB runtime. Which means the FAB needs a way to return assets, but more importantly, needs a way for a FAB to intercept a request for an asset. It's only if you place a CDN in front of your FAB to carve off requests that your FAB won't be invoked for an asset request.
* Should on/off be an option in the build config? Or should it just not be in the config? Do we really want to be doing magic config detection in postinstall scripts?

## `@fab/security-csp`

Liking this naming scheme. This module would:

* Generate and inject a `nonce` on all scripts/links HTML files served by the FAB. Probably customisable.
* Add the corresponding CSP header before the response returns.

Questions:

* Just for HTML files in the FAB when it's built? Or dynamically, as the requests stream out, using something like `HTMLRewriter`.
* If the former, then it actually needs build-time integration, it's not just a runtime module.
* If the latter, we need a story around rewriting & streaming HTML output. In CF workers that's available through the `HTMLRewriter` but what about other hosts? (edit: I'm assured that `HTMLRewriter` will be open-sourced, if we want to add it to the FAB runtime spec)

Preliminary thoughts:

* Given that _some_ times you have the HTML up-front, it seems unnecessary to _only_ use a `HTMLRewriter` approach.
* Why would you want this module? Because you want to easily opt in to having a simple CSP strategy on your app? It doesn't make much sense to work from a proxying point-of-view. BUT, for an app like NextJS where you're server-rendering, you _do_ kinda want this to make it easier to inject on your dynamic pages (considering static ones are pretty easy to handle as-is). What would that look like?

## `@fab/inject-settings`

Very similar to the CSP one, but something almost all top-level FAB targets would want. Needs to add `FAB_SETTINGS` either as a global variable or pass it into the render method.

## `@fab/nextjs`

Probably worth drilling into this now, since this has both static and dynamic pieces.

Vague plan:

* Next is build (needs `target: 'serverless'` & `assetPrefix: '/_assets'`), generating a serverless and `static` directory.
* Inside `serverless`, static pages are rendered as `.html` files, and non-static ones are bundled as `.js`
* The `static` directory can be wholesale-copied to `_assets/_next/static`

But wait, does that even need to happen? Can't we handle _not_ setting an `assetPath` just as easily? Make it an optional enhancement? Maybe!

But as for the HTML-serving routes, I can see this generating two "middlewares":

* One renderer for the static HTML routes:

```js
export default onRequest({ path, context }) {
  if (MY_ROUTES[path]) {
    return MY_ROUTES[path].render(context.injections)
  }
}
```

Couple of assumptions here. That `onRequest` simply doesn't return if it's not relevant. `context.injections` could be `FAB_SETTINGS` but also `nonce`? I guess that implies that the HTML templates that are compiled to JS renderers _already have all the injections in place_, and just need a JS object (`context.injections`) to resolve.

Note: In my mind, `context.injections` has the following format:

```js
"context": {
  "injections": {
    "nonce": "<LONG SHA>",
    "FAB_SETTINGS: { ... }
  }
}
```

For server-rendered NextJS, this [example](https://github.com/zeit/next.js/blob/canary/examples/with-strict-csp/pages/_document.js) gives us a solution:

```js
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const { nonce, FAB_SETTINGS } = ctx.res.locals
    return { ...initialProps, nonce, FAB_SETTINGS }
  }
  
  render() {
    const { nonce, FAB_SETTINGS } = this.props
    // FAB_SETTINGS values used directly, not injected
    return (
      <html>
        <Head nonce={nonce}>
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </html>
    )
  }
}
```

So that implies a renderer middleware that does something a bit more complicated:

```js
export default onRequest({ path, context }) {
  const renderer = RENDERERS_FOR_PATH[path]
  if (renderer) {
    const local_req = {
      url: route,
      method: request.method,
      headers: request.headers,
      connection: {
        encrypted: req_url.protocol === 'https',
      },
    }
    const response = new MockExpressResponse({
      request: local_req,
    })
    Object.assign(response.locals, context.injections)
    await renderer.render(local_req, response)
    return new Response(response._getString(), {
      status: response.statusCode,
      headers: response._headers,
    })
  }
}
```

There's probably a better way but I'll follow the example for now. Also, the above code is copied from my NextJS proof-of-concept so adding streaming responses would be great. At the very least, each middleware (and the spec itself) ought to be _capable_ of returning a streaming response. Which means any other middlewares need to be aware that the body may not be complete if they're trying to intercept it.

One other thing, there's an implicit mapping from `/` to `/index.html` in the current proof-of-concept. Where... does that live in the new plugin system? As an early middleware to change the `path` to `/index`? But what of `/page`, that ought to match `/page`, `/page.html`, and `/page/index.html`. Maybe URL matching is a FAB util like:

```js
import { Routing } from '@fab/utils'

export default onRequest({ path, context }) {
  const renderer = Routing.match(MY_ROUTES, path)
  if (renderer) {
    return renderer.render(context.injections)
  }
}
```

That's not great, but it would work.

