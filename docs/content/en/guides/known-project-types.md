---
title: 'Known Project Types'
category: Guides
position: 202
---

# Known Project Types <small>(for `fab init`)</small>

## Create React App

Needs `react-scripts` version `2.x` or above. Is effectively a `GenericStatic` site with the input directory set to `build` and the HTML fallback set to `/index.html`.

**Notes:**

* Fully client rendered.
* Excellent dev environment and optimised webpack output
* No server-side logic by default

There are definitely things like [proxying api requests in development](https://create-react-app.dev/docs/proxying-api-requests-in-development/) we _could_ autodetect and inject FAB server-side code for, but currently do not. That would be a [good way to contribute](https://fab.dev/guides/contributing), if you like.

## NextJS 9+ (Dynamic, Serverless)

Requires `nextjs` version `9.x` or above, and `next.config.js` to set `target: serverless` (or not be present, in which case `fab init` will create it). Uses `@fab/input-nextjs` to build from the `.next/serverless` output directory.

**Notes:**

* `target: serverless` is not automatically applicable, it assumes that you don't have any [custom server](https://nextjs.org/docs/advanced-features/custom-server) code already. Thankfully Next has gotten [way better at using convention over code](https://nextjs.org/docs/routing/dynamic-routes) so sites on v9+ should be more compatible.
* If you have no `getInitialProps` invocations throughout the app, there isn't actually any server-side rendering taking place. But it's not clear if there's any meaningful difference, then, between treating this as "dynamic" or as an "exported" NextJS app, below.

## NextJS 9+ (Static, Exported)

In recent releases, NextJS has put more emphasis on `Static HTML Exports`(https://nextjs.org/docs/advanced-features/static-html-export) using `next export`. If `next export` is detected, we ask whether you want to be building a FAB from the rendered HTML (in the `out` directory). Then we generate a `fab.config.json5` that includes `@fab/input-static`, rather than `@fab/input-nextjs`, since, at this point, it's a static site, not a Next site.

**Notes:**

* I'm no NextJS pro, so I might be missing something about this setup here. Maybe you know more than me, and want to [help out](https://fab.dev/guides/contributing)?

## Gatsby

This checks for `gatsby build` in the your `npm run build` command, but is then just a `GenericStatic` with the input directory hard-coded to `public`.

## GenericStatic

Anything that's not one of the above is considered a "Generic Static site", which covers the following cases:

* Client-side-rendered React, that's not included in the above frameworks
* VueJS, though not NuxtJS
* AngularJS
* anything else statically-rendered.

This is all driven off two inputs:

* What command do you build your output with (by default `npm run build`)?
* Where does it put its output (by default `build`, `dist` or `out`)?

If that's enough to build your app, you can run `npx fab init --skip-framework-detection` to automatically attempt a `GenericStatic` config.

## Future support

`fab init` currently doesn't help you set up a `fab.config.json5` file _at all_ if your site isn't using one of the aforementioned setups. Particularly for the most complex cases, where custom server-side-rendering code is [needing to be ported](https://fab.dev/)
