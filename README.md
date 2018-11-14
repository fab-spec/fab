# Frontend Application Bundle (FAB) Specification

***extremely work-in-progress voice*** This is extremely work-in-progress. Skip ahead to the [Development Progress](#development-progress) section to see what's good to use right now.

## Specification

```
my-app.b1c53da6.fab
  ├── runtime.js
  ├── settings.json
  └── _assets
        ├── js
        │   ├── main.7fcd9566.js
        │   └── ...
        └── media
            ├── logo_default.e925f90a.svg
            └── ...
```

### `.fab` file format

A zip file created using `deterministic-zip` for content-addressable storage.

### `runtime.js`

A `V8:Isolate`-compatible single-file build of your server-side logic.

Exposes a single entry point:

```js
const renderGet = async (req, res, settings) => {
  // Literally everything goes here.
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