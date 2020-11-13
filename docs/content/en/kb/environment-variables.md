---
title: 'Environment Variables'
category: Knowledge Base
position: 311
---

# Environment Variables

💎 FABs are designed with the needs of modern frontend applications in mind. That is, we understand that **your frontend may run in several different environments**, with variables needing to have particular values injected for each one. For example:

- **Different API URLs for staging/testing/production backends**
- **API keys for third-party services might be different<br/>**
  (switching between testing/live payment integrations, for instance)
- **Features may be turned on or off depending on environment**

To support this, every time your FAB is executed, the current environment variables are injected as the `settings` object:

```js[proxy-api.js]
export default ({ Router }) => {
  Router.on('/api/:route(.*)', ({ params, settings }) => {
    return fetch(`https://${settings.API_URL}/${params.route}`)
  })
}
```

A FAB will default to passing in the **production** environment variables, plus any overrides that are defined by the hosting platform. For [Linc](https://linc.sh), that process is done in a dedicated **Environments** tab on the Site config:

<a href="https://user-images.githubusercontent.com/23264/53847006-35035080-4003-11e9-80d3-b3b3706c6907.png" target="_blank">
<img width="480" align="center" alt="Linc environment screenshot" src="https://user-images.githubusercontent.com/23264/53847006-35035080-4003-11e9-80d3-b3b3706c6907.png"/>
</a>

This defines a `STAGING` environment that will be available through Linc's environment-specific Preview URLs (like `https://example-repo-[FAB_ID]-staging.linc-preview.sh/`). For more information, see the Linc docs.

## Accessing Environment Variables at Runtime

Using the plugin **@fab/plugin-render-html** (which is included by default), any `*.html` files are served with a `<script>` tag injected into the response as it's being streamed to the client:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="text/javascript">
      window.FAB_SETTINGS = {
        "API_URL": "https://staging.api.example.com",
        ...
      }
    </script>
    <meta charset="UTF-8" />
    <title>Document</title>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

Then, inside your JS application those values will be available on the global `window.FAB_SETTINGS` object

```js
// Inside your application

fetch(`${window.FAB_SETTINGS.API_URL}/endpoint`)
  .then
  // ...
  ()
```

To use the same environment variables during development, it's recommended to add a layer of abstraction between `FAB_SETTINGS` (available once the FAB is built) and `process.env` (available during development). For example

```js
// src/config.js

const lookupEnvVar = (name) => {
  // Use window.FAB_SETTINGS if defined
  if (typeof window.FAB_SETTINGS === 'object') {
    return window.FAB_SETTINGS[name]

    // Otherwise use process.env
  } else {
    // Note: some build systems (like Create React App) only expose
    // process.env vars that start with a prefix (like REACT_APP_)
    return process.env[`REACT_APP_${name}`]
  }
}

export default {
  API_URL: lookupEnvVar('API_URL'),
  API_KEY: lookupEnvVar('API_KEY'),
  // ...
}
```

You can use the `config` throughout your app like so:

```js
import config from '../config'

fetch(`${config.API_URL}/endpoint`)
  .then
  // ...
  ()
```

## Bundling Production Settings

One of the most important things to remember about working with Environment Variables and FABs is that **production settings must be bundled into the FAB itself**. This is what enables a FAB to be truly portable—you can upload a FAB to any hosting platform (with the right adapter) and **it can serve production traffic**. That means that wherever you want to host your FAB, it can always serve production traffic because it _has everything it needs in the bundle itself._
