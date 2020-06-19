# @fab/plugin-node-compat

A plugin for serving static HTML files with FAB_SETTINGS injected

## Rationale

Static HTML is a big part of modern frontend applications—whether you're serving all routes as a single page application to a single `index.html` or pre-rendering dozens or hundreds of routes, generating static HTML gives you a bulletproof deploy artifact.

In the FAB ecosystem, however, we want the ability for a compiled FAB to be linked against multiple [environments](https://fab.dev/kb/environment-variables), and so a build-time static HTML file isn't going to work. This module solves that.

## Usage

```json5
{
  plugins: {
    // ...
    '@fab/plugin-node-compat': {
      // Can be left blank. See below for config options
    },
    // ...
  },
}
```

## How it works

`@fab/plugin-node-compat` works by compiling your HTML files into a template (atm we use Mustache but not for any particular reason, it just works), which means that the static HTML files can be dynamically enriched on the server.

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
}
```

Other `injections` are coming, but for the moment this is all.

Need something else customised? [Open an issue](https://github.com/fab-spec/fab/issues)!
