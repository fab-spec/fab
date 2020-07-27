# @fab/plugin-render-html

A plugin for serving static HTML files with FAB_SETTINGS injected

## Rationale

Static HTML is a big part of modern frontend applications—whether you're serving all routes as a single page application to a single `index.html` or pre-rendering dozens or hundreds of routes, generating static HTML gives you a bulletproof deploy artifact.

In the FAB ecosystem, however, we want the ability for a compiled FAB to be linked against multiple [environments](https://fab.dev/kb/environment-variables), and so a build-time static HTML file isn't going to work. This module solves that.

## Usage

```json5
{
  plugins: {
    // ...
    '@fab/plugin-render-html': {
      // Can be left blank. See below for config options
    },
    // ...
  },
}
```

## Configuration

By default, this module has the following options:

```json5
{
  'match-html': '/.html$/i', // path to match for HTML files
  injections: {
    // if not specified, injects only the following module
    env: {
      name: 'FAB_SETTINGS', // which global variable to use?
    },
  },
  fallback: '/index.html', // Which HTML file to use for all routes
  inline: 'fallback-only', // Which HTML files to inline into server.js
}
```

## Injections

`@fab/plugin-render-html` works by compiling your HTML files into a template (atm we use Mustache but not for any particular reason, it just works), which means that the static HTML files can be dynamically enriched on the server.

Most commonly, this will inject the following `<script>` tag into any HTML response as it's being streamed to the client:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="text/javascript">
      window.FAB_SETTINGS = {
        ENV_VAR_NAME: 'env var value',
      }
    </script>
    <!-- ... -->
  </head>
  <!-- ... -->
</html>
```

Your client-side JS can then import the global `FAB_SETTINGS` object to rewire API requests, etc.

## Fallback

> 👉 Valid options are `string | true | false`.

- `false` means don't render a fallback, allow 404s to fall through.
- `string` is the path to the fallback to use (e.g. `/index.html`, `/200.html`)
- `true` (default) is equivalent to `fallback: '/index.html'`

## Inline

> 👉 Valid options are `'fallback-only' | true | false`

This module compiles HTML files to a Mustache partially-rendered templates. These can either be inlined into the `server.js` file for performance or rendered out to `_assets` files to be stored alongside any other objects in the FAB. This is particularly important for hosting platforms like Cloudflare Workers which have a default worker limit (i.e. max size of `server.js`) of 1MB.

- `false` means save all HTML templates to `_assets` (safest for large sites)
- `true` means inline all HTML templates to `server.js` (fastest for small sites)
- `'fallback-only'` means _only_ inline the fallback file (safe, and fastest for SPA-style apps)
