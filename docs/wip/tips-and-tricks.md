# Tips & Tricks

Really want to put these somewhere, will paste it here for now:

## Triggering requests in background

This is only really a problem on Cloudflare Workers, because a worker can't call itself (i.e. you can't do the following:)

```js
export default ({ Router }) => {
  Router.on('/something', async ({ url }) => {
    // no await, kick this off in the background
    fetch(`${url.origin}/slow-background-process`)

    return //...
  })
}
```

Actually this might not work on Lambda@Edge either, since the URL that comes through in the origin isn't resolvable from within the lambda? I can't remember...

### Solution: use `Link` headers

If it's a browser that's triggering the request, you can kick off a "background" request by telling the browser to also hit another url, using `Link` headers with the `preload` directive: https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/#headers

### Example

```ts
import { FABRuntime } from '@fab/core'

export default ({ Router }: FABRuntime) => {
  Router.on('/', async () => {
    return new Response(
      `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
  </head>
  <body>
    Ok smarty.
  </body>
</html>
    `,
      {
        headers: {
          'content-type': 'text/html',
          Link: `</hax.js>;rel="preload";as="script",</dank>;rel="preload";as="fetch"`,
        },
      }
    )
  })

  Router.on('/hax.js', async ({ request }) => {
    console.log('OMFG I AM A LEGEND')
    console.log(request.headers)

    return new Response(
      `
      console.log('DO I GET RUN?')
    `,
      {
        headers: {
          'content-type': 'application/javascript',
        },
      }
    )
  })

  Router.on('/dank', async ({ request }) => {
    console.log('BOTH REQUESTS?')
    console.log(request.headers)

    return new Response(`response 2`)
  })
}
```

![image](https://user-images.githubusercontent.com/23264/87548532-8534fd00-c6a4-11ea-85e2-76407477cb0b.png)

```
        [Server] Reading fab.zip…
        [Server] ✔ Done. Booting FAB server…
        [Server] ✔ Done. Booting VM…
        [Server] NOTE: Watching fab.zip for changes…
        [Server] ✔ Done.
        [Server] Listening on http://localhost:9101
        [Server] /
OMFG I AM A LEGEND
Headers {
  [Symbol(map)]: [Object: null prototype] {
    host: [ 'localhost:9101' ],
    'user-agent': [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:79.0) Gecko/20100101 Firefox/79.0'
    ],
    accept: [ '*/*' ],
    'accept-language': [ 'en-AU,en;q=0.7,en-US;q=0.3' ],
    'accept-encoding': [ 'gzip, deflate' ],
    dnt: [ '1' ],
    connection: [ 'keep-alive' ],
    referer: [ 'http://localhost:9101/' ],
    cookie: [
      'ajs_user_id=null; ajs_group_id=null; ajs_anonymous_id=%2273c585ef-7d79-44cf-a316-cab35afacff3%22; amplitude_id_bef388d56f2dc2ff10ba62a0565ea95a=eyJkZXZpY2VJZCI6ImRiZDc4ZjgxLTQ2ZTctNGQ4NC1iMTVhLTdmZmIxNmVhYzNkYVIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTU3ODUxNzc4MTY1MiwibGFzdEV2ZW50VGltZSI6MTU3ODUxNzc4MTY1MiwiZXZlbnRJZCI6MSwiaWRlbnRpZnlJZCI6MSwic2VxdWVuY2VOdW1iZXIiOjJ9; ckns_privacy=july2019; ckns_policy=111; ckns_explicit=1; googlepersonalization=Os3hEcOs3hEcgA; eupubconsent=BOs3hEcOs3hEcAKAAAENAAAA2AAAAA; euconsent=BOs3hEcOs3hEcAKAABENC2-AAAAtFr_7__7-_9_-_f__9uj3Or_v_f__30ccL59v_h_7v-_5fi_20nV4u_1vft9yfk1-5ctDztp505iakivHmqNeb9v_mz1_5pxP78k89r7337Ew_v8_v-b7JCON_A; atuserid={%22val%22:%227ab83313-e17f-402f-842e-6019b32820d8%22}; i18n_redirected=en; ph_7NjgIPI-glqDxkou-pLl54SgHp0wgGiowvxIPDXcy5M_posthog=%7B%22distinct_id%22%3A%20%22171c63cc317a-0f60f268bf00938-4b5569-4b9600-171c63cc318689%22%2C%22%24device_id%22%3A%20%22171c63cc317a-0f60f268bf00938-4b5569-4b9600-171c63cc318689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; connect.sid=s%3AlUnGT-NvX5q7n0nGc64JDZ3Gw1i824XJ.TvpxCZHaIgzJVTvwdh06plpj4XtScNHUFq4s5366kG0; _cmpQcif3pcsupported=1; _rails_fab_session=f8vl5lAneYlMsrnLjRlUh1ehVA0RYCtwQ22jasQAG2btfv0M%2Fv2el3QcuykCGCUkbjqnHH7UIHg4Pa8AMGsxB6aPInbA%2Bhg5IioRGm7v3ZAhKTJ9K7t9EfX0ZSKqDWmbTZ9yhDLFCUTLaUV2VNfCdwSLS%2BVpYyEVEMxW2stbRW%2BMRFi%2FURmaXO%2FZYcRNHkgVtklkTsVEQTYHmK7EwyvKrT2JyomXGLZY4oUdN7k1w%2Bt2Ei8Mc6cX6yxAUU5J96ZFjxRtgU1MVwHQEhnHJBnS65%2BJoVU73kSdQ8Q%3D--xMR0fm80MH4mmPhA--mWF0G4qgZ2cG3SVri4FLGg%3D%3D; io=BNIzncmy_si5cCT0AAUf; nuxt-color-mode=light'
    ],
    'if-none-match': [ 'W/"28-M3PxWLrajY4EOoQUkuUDbVWRW7w"' ],
    'cache-control': [ 'max-age=0' ]
  }
}
        [Server] /hax.js
BOTH REQUESTS?
Headers {
  [Symbol(map)]: [Object: null prototype] {
    host: [ 'localhost:9101' ],
    'user-agent': [
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:79.0) Gecko/20100101 Firefox/79.0'
    ],
    accept: [ '*/*' ],
    'accept-language': [ 'en-AU,en;q=0.7,en-US;q=0.3' ],
    'accept-encoding': [ 'gzip, deflate' ],
    dnt: [ '1' ],
    connection: [ 'keep-alive' ],
    referer: [ 'http://localhost:9101/' ],
    cookie: [
      'ajs_user_id=null; ajs_group_id=null; ajs_anonymous_id=%2273c585ef-7d79-44cf-a316-cab35afacff3%22; amplitude_id_bef388d56f2dc2ff10ba62a0565ea95a=eyJkZXZpY2VJZCI6ImRiZDc4ZjgxLTQ2ZTctNGQ4NC1iMTVhLTdmZmIxNmVhYzNkYVIiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTU3ODUxNzc4MTY1MiwibGFzdEV2ZW50VGltZSI6MTU3ODUxNzc4MTY1MiwiZXZlbnRJZCI6MSwiaWRlbnRpZnlJZCI6MSwic2VxdWVuY2VOdW1iZXIiOjJ9; ckns_privacy=july2019; ckns_policy=111; ckns_explicit=1; googlepersonalization=Os3hEcOs3hEcgA; eupubconsent=BOs3hEcOs3hEcAKAAAENAAAA2AAAAA; euconsent=BOs3hEcOs3hEcAKAABENC2-AAAAtFr_7__7-_9_-_f__9uj3Or_v_f__30ccL59v_h_7v-_5fi_20nV4u_1vft9yfk1-5ctDztp505iakivHmqNeb9v_mz1_5pxP78k89r7337Ew_v8_v-b7JCON_A; atuserid={%22val%22:%227ab83313-e17f-402f-842e-6019b32820d8%22}; i18n_redirected=en; ph_7NjgIPI-glqDxkou-pLl54SgHp0wgGiowvxIPDXcy5M_posthog=%7B%22distinct_id%22%3A%20%22171c63cc317a-0f60f268bf00938-4b5569-4b9600-171c63cc318689%22%2C%22%24device_id%22%3A%20%22171c63cc317a-0f60f268bf00938-4b5569-4b9600-171c63cc318689%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%7D; connect.sid=s%3AlUnGT-NvX5q7n0nGc64JDZ3Gw1i824XJ.TvpxCZHaIgzJVTvwdh06plpj4XtScNHUFq4s5366kG0; _cmpQcif3pcsupported=1; _rails_fab_session=f8vl5lAneYlMsrnLjRlUh1ehVA0RYCtwQ22jasQAG2btfv0M%2Fv2el3QcuykCGCUkbjqnHH7UIHg4Pa8AMGsxB6aPInbA%2Bhg5IioRGm7v3ZAhKTJ9K7t9EfX0ZSKqDWmbTZ9yhDLFCUTLaUV2VNfCdwSLS%2BVpYyEVEMxW2stbRW%2BMRFi%2FURmaXO%2FZYcRNHkgVtklkTsVEQTYHmK7EwyvKrT2JyomXGLZY4oUdN7k1w%2Bt2Ei8Mc6cX6yxAUU5J96ZFjxRtgU1MVwHQEhnHJBnS65%2BJoVU73kSdQ8Q%3D--xMR0fm80MH4mmPhA--mWF0G4qgZ2cG3SVri4FLGg%3D%3D; io=BNIzncmy_si5cCT0AAUf; nuxt-color-mode=light'
    ],
    'if-none-match': [ 'W/"a-Oy0jUyPNMBtrf34WML0IlO/X/GY"' ],
    'cache-control': [ 'max-age=0' ]
  }
}
        [Server] /dank
```

👍
