---
title: Adding Server-Side Logic
description: 'Use the FAB Runtime API to add server-side logic to your FAB'
category: Guides
position: 204
---

One of the best use-cases for FABs, once your project [can produce a working FAB](/guides/getting-started), is to add small amounts of server-side logic to a mostly-static build, _without needing to change how you package & deploy your application_. This guide shows you how.

> 👉 While some of these examples may be possible with "static" hosting providers, that always requires [vendor-specific configuration](#an-aside-static-hosting-isnt-really-static). FAB offers a different approach, since server-side JavaScript is always available, we can use **code over configuration**:

## Proxying a simple API

It can be quite convenient to proxy your backend API behind a route on your frontend, e.g. wiring up `https://example.com/api` connecting behind-the-scenes to `https://api.example.com`. This can help with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) concerns or simply to allow your frontend to freely connect to different backends. We can achieve this by connecting to the FAB's (server-side) Router:

```js
// proxy-api.js
export default ({ Router }) => {
  Router.on('/api/:route(.*)', ({ params }) => {
    return fetch(`https://api.example.com/${params.route}`)
  })
}
```

Adding this to your `fab.config.json5` to include it in your build:

```json5
{
  plugins: {
    // ...
    './server/proxy-api': {},
    // ...
  },
  // ...
}
```

> 👉 Further examples on this page will omit this step, read the [Plugins](/kb/plugins) page for full details about configuring your `plugins` section of your configuration.

## Proxying an authenticated GraphQL API

The above example is great if your API mostly sends `GET` requests, without authentication, but for a real-world use case like a GraphQL endpoint you need to forward the incoming request's `method` of `POST`, as well as headers like `Authentication`. However, you can't simply forward _all_ the headers along, since headers like `host` must match the destination, not the FAB's public URL.

This is all neatly captured by FAB's server-side API:

```js
export default function ({ Router }) {
  // Match any URL starting with /graphql
  Router.on('/graphql(.*)', ({ settings, url, request }) => {
    // Clone the incoming request so we can edit it
    const forwarded_request = new Request(request)
    // Change the one header we need to in this case, reading from `settings`
    forwarded_request.headers.set('host', settings.API_HOST);
    // Build up our URL to proxy to using our API_HOST and our original request's pathname
    const forwarded_url = `https://${settings.API_HOST}${url.pathname}`;
    // Create a new Request with the new URL and our updated headers
    return fetch(new Request(forwarded_url, forwarded_request));
  });
}
```

This makes use of FAB's in-built support for [Settings](/kb/settings), that let you centralise your config into your `fab.config.json5`:

```json5
{
  // ...
  settings: {
    'production': {
      API_HOST: 'api.example.com'
      // ...
    },
    // ...
  },
  // ...
}
```

## Typescript Components

Note, you can use Typescript without needing a separate compile step, so we recommend doing so (and further examples will):

> 👉 Even if you're not using Typescript for the rest of your project, your IDE may well have much better code completion & error-checking if you use it here.

```ts
// proxy-api.ts
import { FABRuntime } from '@fab/core'

export default function({ Router }: FABRuntime) {
  Router.on('/api/:route(.*)', ({ params }) =>
    fetch(`https://api.example.com/${params.route}`)
  )
}
```

You can also use [Settings](/kb/settings) to inject your API location, rather than hard-coding it into the handler:

```ts
// proxy-api.ts
import { FABRuntime } from '@fab/core'

export default function({ Router }: FABRuntime) {
  Router.on('/api/:route(.*)', ({ params, settings }) =>
    fetch(`${settings.API_URL}/${params.route}`)
  )
}
```

## Making a simple server-side request on a URL

You can also transform the responses using the same [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) available in browsers & service workers:

```ts
// add-geolocation-endpoint
import { FABRuntime } from '@fab/core'

export default ({ Router }: FABRuntime) => {
  Router.on('/geolocate', async () => {
    const geo_response = await fetch('http://ip-api.com/json')
    const geo_json = await geo_response.json()
    const { country, regionName, city } = geo_json
    return new Response(
      `This request is being served from ${city} in ${regionName}, ${country}.`,
      {
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    )
  })
}
```

## Attaching a FAB bundle ID header to all outgoing responses

```ts
// attach-bundle-id.ts
import { FABRuntime } from '@fab/core'

export default ({ Router, ServerContext }: FABRuntime) => {
  Router.interceptResponse(async (response) => {
    response.headers.set('X-FAB-ID', ServerContext.bundle_id)
    return response
  })
}
```

## Checking a cookie before allowing a request to proceed

```js
// check-cookie.ts
import { FABRuntime, Priority } from '@fab/core'
import { checkValidity } from 'somewhere'

export default ({ Router }: FABRuntime) => {
  // Could also use Router.on('*') here
  Router.onAll(async ({ request }) => {
    const cookie = request.cookies['My-Auth']
    if (!cookie || !checkValidity(cookie)) {
      // Allow the rest of the handlers to proceed
      return undefined
    } else {
      return new Response(null, {
        status: 401,
        statusText: 'Unauthorized',
      })
    }
  }, Priority.FIRST)
}
```

### An aside: "Static" hosting isn't really static

Something that's often overlooked when choosing a hosting provider for a "static" project (e.g. client-side rendered or JAMstack) is that there is a whole host of server-side concerns that don't neatly fit into uploading a directory full of HTML files. These invariably end up being captured as vendor-specific config files, such as those for [Netlify](https://docs.netlify.com/configure-builds/file-based-configuration), [Vercel](https://vercel.com/docs/configuration) or [Firebase](https://firebase.google.com/docs/hosting/full-config); or configuration settings in the platform itself, such as for [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html).

For example, proxying requests that come in on `/api/*` to `api.example.com/*` would be done using the following section in your `netlify.toml` file:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://api.example.com/:splat"
  status = 200
  force = true
```

Compare that to the [Proxying an API](#proxying-an-api) section above. Now your server-side logic is self-contained, portable, and "just JavaScript".
