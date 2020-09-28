---
title: 'Server-Side Routing'
category: Plugins
position: 293
---

# Server-Side Routing

## Overview

Runtime plugins may optionally apply logic only for specific routes. The FABRuntime's Router will match requests to routes you declare in order to invoke your custom logic.

To use the Router, we recommend destructuring it out of the FABRuntime passed to your runtime plugin:

```ts
import { FABRuntime } from '@fab/core'

export default myRuntimePlugin({ Router }: FABRuntime) {
  // your custom logic goes here!
}
```

## Route declaration

Routes are declared in a manner similar to many client-side routers:

```ts
Router.on(theUrlToMatch, myRequestHandler)
```

### Route matching and parameterization

Routes begin with a leading slash (`/`):

```ts
Router.on('/somewhere/over/the/rainbow', myRequestHandler)
```

Parameterized route segments are indicated with a colon (`:`):

```ts
Router.on('/somewhere/:preposition/the/:thing', myRequestHandler)
```

The Router also supports applying custom handlers to all requests using one of the following methods:

```ts
Router.on('*', myRequestHandler)
// is an alias for
Router.onAll(myRequestHandler)
```

> NOTE: Request handlers, when added, are added as the next chain link in the request pipeline. If multiple handlers match a route, handlers will be invoked in declaration order until one [returns a value](#request-handlers).

> NOTE: Under the hood, routes other than `*` are parsed using [`path-to-regexp`](https://github.com/path-to-regexp)

### Request handlers

A request handler, generally declared as an `async function`, will be called with an object containing the following values:

```ts
Router.on('/somewhere/:preposition/the/:thing', async function({
  // an object containing parameters parsed from the route
  // in this example route, it would be { preposition: string, thing: string }
  params,

  // the Request to be handled
  request,

  // any FABSettings provided
  settings,

  // the URL of the Request
  url,
}) {
  /* return a value here! */
})
```

A request handler returns a `Promise` that resolves to one of the following:

1. [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)

> A response to the request. This Response will be sent back to the client.

```ts
async function returnsResponse({ request }) {
  // maybe you don't like cats?
  if (request.url.includes('cat.gif')) {
    // show them a dog instead!
    return new Response(null, {
      status: 301,
      headers: {
        Location: '/dog.gif',
      },
    })
  }
}
```

2. [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)

> Instruct the FABRuntime to issue this Request to something external to the FAB, e.g., to a backend API.

```ts
async function returnsRequest({ request }) {
  const { url } = request
  if (url.includes('/api/')) {
    // proxy a completely different request to an external resource
    const apiPath = url.substring(url.indexOf('/api/') + '/api/'.length)
    return new Request(`https://some-other.api/${apiPath}`, request.clone())
  }
}
```

3. `Directive`

> An object used to intercept the `Response` and/or replace the `Request`:

```ts
async function returnsDirective({ request }) {
  const { url } = request
  // maybe you don't like dogs?
  if (request.url.includes('dog.gif')) {
    return {
      // look for a cat instead
      replaceRequest: new Request('/cat.gif', request.clone()),
      interceptResponse: (response) =>
        response.status === 200
          ? // if it is found, make sure to cache it for a year!
            new Response(response.clone().body, {
              ...response.clone(),
              headers: {
                ...response.clone().headers,
                'Cache-Control': 'public, immutable, max-age=31536000',
              },
            })
          : // guess we couldn't find it ¯\_(ツ)_/¯
            response,
    }
  }
}
```

4. `undefined`

> Indicates to the FABRuntime that this request handler was unable to handle the request, so it should fall through to the next handler.

```ts
async function returnsUndefined({ request }) {
  const { url } = request

  // we only know how to handle cat gifs
  if (!url.includes('cat.gif')) {
    return undefined
  }

  // we only know how to handle these aliases
  const aliases = ['kitty', 'kitten', 'catling', 'kitter']
  if (!aliases.some((alias) => url.includes(`${alias}.gif`))) {
    // not an alias we recognize
    return undefined
  }

  // handle the alias appropriately
  // ...
}
```
