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

To support this, every time your FAB is executed, the current environment variables are injected. This is the `render` method at the heart of a FAB:

```jsx
const render = async (request, settings) => {
  // request: a fetch.Request object
  // settings: your production settings plus any
  //           environment-specific overrides

  const { body, statusCode, headers } = await myApp.render(request, settings)

  // return a fetch.Response object with the full data.
  // Streaming responses not yet fully supported, but will be.
  return new Response(body, { statusCode, headers })
}
```

A FAB will default to passing in the **production** environment variables, plus any overrides that are defined by the hosting platform. For [Linc](https://linc.sh), that process is done in a dedicated **Environments** tab on the Site config:

<a href="https://user-images.githubusercontent.com/23264/53847006-35035080-4003-11e9-80d3-b3b3706c6907.png" target="_blank">
<img width="480" align="center" alt="Linc environment screenshot" src="https://user-images.githubusercontent.com/23264/53847006-35035080-4003-11e9-80d3-b3b3706c6907.png"/>
</a>

This defines a `STAGING` environment that will be available through Linc's environment-specific Preview URLs (like `https://example-repo-[FAB_ID]-staging.linc-preview.sh/`). For more information, see the Linc docs.

## Bundling Production Settings

One of the most important things to remember about working with Environment Variables and FABs is that **production settings must be bundled into the FAB itself**. This is what enables a FAB to be truly _portable_—you can upload a FAB to any hosting platform (with the right adapter) and **it can serve production traffic**. That means that whether you want to host your own FAB, wrap it up in a [Lambda@Edge](https://github.com/fab-spec/lambda-edge-packager) or [Cloudflare Worker](https://github.com/fab-spec/cloudflare-workers-packager), it can always serve production traffic because it _has everything it needs in the bundle itself._

In practice, that's done using a `production-settings.json` file that your FAB compiler (e.g. [**@fab/static**](/packages/fab-static#environment-variables)) will include into your bundle.

## Exposing Settings to the Frontend

The FAB specfication only defines one place that the `settings` object is injected: the server-side `render` method. It's up to the the particular bundler to pass that through to the client-side JavaScript, but its recommended to follow the example set by [**@fab/static**](/packages/fab-static#environment-variables) and provide a `FAB_SETTINGS` global variable in the HTML as it's sent to the client.

[Read more about **@fab/static**'s approach here.](/packages/fab-static#accessing-environment-variables-at-runtime)
