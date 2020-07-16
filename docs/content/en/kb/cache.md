---
title: 'Cache layer'
category: Knowledge Base
position: 306
---

# TEST 5

# Cache layer

A FAB uses a totally [stateless request-response model](https://acloud.guru/forums/aws-certified-solutions-architect-associate/discussion/-KIbOMbOWAdrGAHG0xFh/stateful-stateless-web-service?answer=-KIbiH9anmti9bwC3TDK), but the hosts that execute them often have a way to preserve state between requests. Rather than leave this up to the runtime, FABs provide a `Cache` object on the runtime to permit access to this storage (if it exists):

```ts[counter.js]
import { FABRuntime } from '@fab/core'

export default ({ Router, Cache }: FABRuntime) => {
  Router.on('/cache-test', async () => {
    const n = (await Cache.getNumber('cache-test')) || 0
    await Cache.set('cache-test', n + 1)
    return new Response(`This page has been called ${n + 1} times.\n`)
  })
}
```

## Type definition

```ts[types.ts]
export type FabCache = {
  set: (key: string, value: FabCacheValue, ttl_seconds?: number) => Promise<void>
  setJSON: (key: string, value: any, ttl_seconds?: number) => Promise<void>
  get: (key: string) => Promise<string | undefined>
  getJSON: (key: string) => Promise<any | undefined>
  getNumber: (key: string) => Promise<number | undefined>
  getArrayBuffer: (key: string) => Promise<ArrayBuffer | undefined>
  getStream: (key: string) => Promise<ReadableStream | undefined>
}
```

## No-op implementation

Each FAB ships with a no-op implementation in case the server doesn't provide one:

```ts[no-op-cache.ts]
class NoopCache implements FabCache {
  set = async () => {}
  setJSON = async () => {}
  get = async () => undefined
  getJSON = async () => undefined
  getArrayBuffer = async () => undefined
  getNumber = async () => undefined
  getStream = async () => undefined
}
```

This means that code that correctly uses the `Cache` will run successfully on a host that doesn't provide one, it'll behave as if the Cache is permanently empty. In the above example, the page will always return:

```
This page has been called 1 times.
```

## `@fab/server` implementation

`@fab/server` (which forms the basis of all NodeJS hosting implementations), uses [a very simple in-memory cache](https://github.com/fab-spec/fab/blob/master/packages/server/src/cache.ts). This means changes are _instantly visible_ to all other requests, but _only on the same FAB runtime_ (i.e. same process on the same host).

## AWS Lambda@Edge implementation

This uses [very similar code](https://github.com/fab-spec/fab/blob/master/packages/deployer-aws-lambda/templates/index.js#L30) as `@fab/server` (with the caveat that streams are simplified, since there is no streaming on AWS Lambda@Edge). Each concurrent Lambda keeps an in-memory cache, so subsequent requests will have access to the data _but parallel requests will not_.

> 👉 Note: adding [Elasticache](https://aws.amazon.com/elasticache/) (which is Redis/Memcached and would be ideal for this purpose) to the FAB AWS Lambda releaser is an [open issue](https://github.com/fab-spec/fab/issues/208) on the FAB project.

## Cloudflare KV Store implementation

FABs running on Cloudflare are _truly stateless_, so no in-memory caching is possible. However, their [KV Store](https://developers.cloudflare.com/workers/reference/storage) is a global key-value store, with a spookily [similar API](https://developers.cloudflare.com/workers/reference/apis/kv), making [the FAB implementation](https://github.com/fab-spec/fab/blob/master/packages/deployer-cf-workers/templates/index.js#L39) quite minimal:

```js
class Cache {
  async set(key, value, ttl_seconds) {
    KV_FAB_CACHE.put(key, value, ttl_seconds ? { expirationTtl: ttl_seconds } : undefined)
  }
  async setJSON(key, value, ttl_seconds) {
    await this.set(key, JSON.stringify(value), ttl_seconds)
  }
  async get(key) {
    return KV_FAB_CACHE.get(key)
  }
  async getJSON(key) {
    return KV_FAB_CACHE.get(key, 'json')
  }
  async getArrayBuffer(key) {
    return KV_FAB_CACHE.get(key, 'arrayBuffer')
  }
  async getNumber(key) {
    return KV_FAB_CACHE.get(key, 'json')
  }
  async getStream(key) {
    return KV_FAB_CACHE.get(key, 'stream')
  }
}
```

> 👉 Note: the KV storage is a paid feature on Cloudflare. You will need to use their \$5/month plan to get access to it. If your account does not have KV access, or if you're deploying with an API token that has no KV store privileges, _you will fall back to the No-op Cache_.

### Performance

The KV store is eventually consistent, and globally replicated, so it can take >1s for values to be read after reading. That said, _all FABs running worldwide share a Cache_, which makes different use-cases possible.

There is also a hot/cold aspect to KV keys, where recently-updated keys are quicker to update again.

You can test the simple counter code from above at the following URL: https://next.fab.dev/cache-test

Running a simple command-line tool, we can see how long it takes for the KV-backed Cache to update:

```
> while true; do date; sleep 1; done &
[1] 17000
Wed 15 Jul 2020 14:35:55 BST
glen@vera-2
> while true; do curl https://next.fab.dev/cache-test; done;
This page has been called 89 times.
Wed 15 Jul 2020 14:35:56 BST
This page has been called 90 times.
This page has been called 90 times.
This page has been called 90 times.
This page has been called 90 times.
Wed 15 Jul 2020 14:35:57 BST
This page has been called 90 times.
This page has been called 90 times.
This page has been called 91 times.
This page has been called 91 times.
Wed 15 Jul 2020 14:35:58 BST
This page has been called 91 times.
This page has been called 91 times.
This page has been called 91 times.
This page has been called 92 times.
Wed 15 Jul 2020 14:35:59 BST
This page has been called 92 times.
This page has been called 92 times.
This page has been called 93 times.
This page has been called 93 times.
Wed 15 Jul 2020 14:36:00 BST
This page has been called 93 times.
This page has been called 93 times.
This page has been called 93 times.
This page has been called 93 times.
Wed 15 Jul 2020 14:36:01 BST
This page has been called 93 times.
This page has been called 93 times.
This page has been called 94 times.
Wed 15 Jul 2020 14:36:02 BST
This page has been called 95 times.
This page has been called 95 times.
This page has been called 96 times.
This page has been called 96 times.
Wed 15 Jul 2020 14:36:03 BST
This page has been called 96 times.
This page has been called 97 times.
This page has been called 98 times.
Wed 15 Jul 2020 14:36:04 BST
This page has been called 98 times.
This page has been called 98 times.
This page has been called 98 times.
This page has been called 98 times.
```

As you can see, write/read performance can be variable, but it's still extremely useful to have a shared, global `Cache` object for edge-rendering.
