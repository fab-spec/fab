---
title: 'Streaming'
category: Knowledge Base
position: 305
---

# Streaming responses

As of `v1.0.0-rc2`, both `@fab/server` and `@fab/deployer-cf-workers` have verified streaming support, using the [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) API:

```ts[slowly.ts]
import { FABRuntime } from '@fab/core'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export default ({ Router }: FABRuntime) => {
  Router.on('/slowly', async () => {
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue('Des\n')
        await sleep(500)
        controller.enqueue('pa\n')
        await sleep(500)
        controller.enqueue('cito.\n')
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  })
}
```

<base-alert type="info">

Note, the `start` method on a `ReadableStream` isn't actually an `async` method (it is never `awaited`), so you **_must_** call `controller.close()` at the end of the function.

</base-alert>

## Binary streams

```ts[alphabet.ts]
import { FABRuntime } from '@fab/core'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export default ({ Router }: FABRuntime) => {
  Router.on('/alphabet', async () => {
    const stream = new ReadableStream({
      type: 'bytes',
      async start(controller) {
        // ASCII codes for 'ABC\n'
        controller.enqueue(new Uint8Array([65, 66, 67, 10]))
        await sleep(500)
        // ASCII codes for 'DEF\n'
        controller.enqueue(new Uint8Array([68, 69, 70, 10]))
        await sleep(500)
        // ASCII codes for 'GHI\n'
        controller.enqueue(new Uint8Array([71, 72, 73, 10]))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  })
}
```

```sh
> curl http://localhost:3000/alphabet
ABC
DEF
GHI
```

## Working example:

Streaming responses are part of any solution that offers the best possible performance out of an endpoint: you can flush the HTTP Headers and the first initial chunk of body content as soon as it's ready, then leave the connection open and send the remainder when it's ready. Given the web's birth during a time of extremely limited bandwidth, browsers will faithfully render what they have as soon as they get it.

But, in order to test this functionality, it's helpful to go the other way: render the slowest possible endpoint, dripped one line at a time, to make sure each chunk is sent individually. And what's Spanish for slowly?

<div class="inline-video">
  <iframe src="https://www.youtube.com/embed/kJQP7kiw5Fk?start=27&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  </iframe>
</div>

```sh
curl https://despacito.glen.workers.dev
```

This is a FAB running on Cloudflare Workers, that sends down each line of the lyrics in time with the music (if you time the start correctly). And despite the total request taking 4+ minutes to complete, it still only uses a few milliseconds of CPU time!

<base-alert type="info">

Sadly, this endpoint is not currently rendering line-by-line in the browsers I've tested, but works just great using `curl` (use the `-N` flag to force buffering off).

</base-alert>

## How it works:

The lyrics are in [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) format, parsed using [webvtt-parser](webvtt-parser). To construct your own, see [this Gist](https://gist.github.com/geelen/779758741e57f717a93e7bff7f2a6c5f)

Each line of the subtitles file is converted into a specific `setTimeout` call on the `ReadableStream`:

```js[despacito.js]
export default ({ Router }) => {
  Router.on('/', async ({ url }) => {
    // Each cue (line of the song) has the format {startTime (in seconds), text}

    const [first_cue, ...rest] = cues

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(first_cue.text + '\n')
        rest.forEach((cue, i) => {
          setTimeout(() => {
            controller.enqueue(cue.text + '\n')
            if (i === rest.length - 1) controller.close()
          }, 1000 * (cue.startTime - first_cue.startTime))
        })
      },
    })

    return new Response(stream, {
      headers: {
        'content-type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    })
  })
}
```
