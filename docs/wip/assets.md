This brain-dump branches off from the [overarching brain-dump]. Go read that first.

## The Asset Problem

Frontend applications are primarily made up of a collection of assets: JS bundles, CSS files, images, fonts, pre-rendered HTML, etc. Regardless of how much logic you have on the server side, most applications are still predominantly a collection of assets.

Assets have 3 defining characteristics:

- They're big. JS bundles can quickly grow to 100s or even 1000s of KB, images similarly so. As a result, how quickly they're served has a big impact on speed.
- They're inert. While there may be some very minimal logic defining how they're served (e.g. switching in a WebP image for a JPG, checking auth before serving), the assets themselves are inert chunks of bytes, so they can be served (& cached) anywhere.
- They're persistent. Some assets will change with each release, but most will not. You don't want to invalidate any caches of assets that haven't changed, and furthermore, anyone using an older deploy of your app will be referencing old assets, so they should not be removed.

As a result, the FAB v0 specification makes two guarantees about assets: that they'll all be within the `/_assets` directory (both in terms of FAB structure & as a public URL), and that they'll be "fingerprinted" or "revision-stamped" (i.e. the filename will contain a hash of the contents). This has the following consequences:

- Assets can be hosted somewhere different to the server (e.g. an S3 bucket). It is safe to deploy many FABs' assets to the same location because files will only have the same name if they have the same contents.
- Requests can be forked off at a CDN level by path. For example, using AWS it's fairly trivial to set up Cloudfront to route `/_assets` to an S3 bucket and leave all other routes to fall back to the FAB server.
- Easy caching at the edge. Because assets are fingerprinted, they can be served with `cache-control: immutable`, which is ideal for CDN optimisation.

All of these remain desirable properties of the FAB spec, but for FAB v1 there is one major area to address:

> What about applications that have fingerprinted, immutable assets, but not under the `/_assets` path?

Which can be considered a specialisation of:

> How can a FAB server efficiently serve an asset?

## Potential solutions

In FAB v0, `@fab/compile` has a catch-all rule that moves any file not in either `_assets` or `_server` inside `.fab/intermediate` into the `_assets` dir of `.fab/build`. It also renames it because it assumes that

---

## Dreamcode

```json5
// fab.config.json
{
  build: {
    '@fab/render-html': {},
    '@fab/rewrite-assets': {},
  },
  render: {
    '@fab/render-html': {},
    '@fab/rewrite-assets': {
      'treat-as-immutable': ['/static/*'],
    },
  },
}
```
