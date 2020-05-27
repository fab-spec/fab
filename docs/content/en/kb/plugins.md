---
title: 'Plugins'
category: Knowledge Base
position: 303
---

# Plugins

FAB plugins are different to other JS web tooling due to one important fact: **plugins are invoked during _both_ compile time _and_ at runtime**. This means a plugin can read/manipulate a FAB as it's being constructed, and _also inject the server-side code_ needed at runtime.

For a lot of common use cases, runtime-only plugins will be all you need, and the [Adding Server-Side Logic](/guides/adding-server-side-logic) guide has a bunch of examples there. Here, we'll talk about the more advanced use-cases.

The best way to understand how this works is with an example:

## Example: Generating 301 redirects for old blog URLs

Let's say our website previously had a bunch of articles online at `/posts/:id` (e.g `http://example.com/posts/123`), but now we've moved to slightly SEO-friendlier URLs that have the post title in them: `/articles/:id-:title` (e.g `https://example.com/articles/123-top-10-cats-of-all-time`.

There's still lots of traffic hitting the old links, and some decent search rankings for the terms, so we want to bring that across to the new URL using a [301 redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301). But when our server gets a request for `/posts/123`, it doesn't _know_ what the new URL is: it knows it will start with `/articles/123-` but unless we provide it a lookup table of all the artile titles (or it makes a request to a database or CMS with that info), it doesn't have enough information to redirect properly.

At build time, however, we _do_ know all the URLs that we need to redirect, so we can generate a FAB with the relevant info. To do that we'll use the `metadata` [property](/api#protofabmetadata) on the [`ProtoFab`](/api#protofab) object. This object gets serialised as part of the build process and injected into the FAB for runtime plugins to use.

In this example, we'll assume that the new blog posts have been rendered out to the filesystem as `/articles/123-top-10-cats-of-all-time.html`, which means they're already available on the [`proto_fab.files`](/api#protofabfiles) object. But we could just as easily hit the API of our CMS to get the current articles, all we need is the list of URLs to generate redirects for:

```js
// server/redirect-old-blog-urls/build.js

// Note: the 'build' and 'runtime' stages need to written
// as separate files, explained in the next section.

// All build plugins must export this function and only this funciton
export const build = async (args, proto_fab) => {
  // Anything we attach to proto_fab.metadata is serialised
  // and available to your runtime code. It is convention
  // to always pass through the args from our config file.
  proto_fab.metadata.article_urls = { args }

  // Loop through all the HTML files in the FAB
  for (const filename of proto_fab.files.keys()) {
    // Look for anything looking like /articles/123-new-post-format.html
    const matches_article_url = filename.match(/^(\/articles\/(\d+).*)\.html/)
    if (matches_article_url) {
      // Store the full URL against the article ID
      const [_, url, article_id] = matches_article_url
      proto_fab.metadata.article_urls[article_id] = url
    }
  }
}
```

After this, we should have `proto_fab.metadata.article_urls` full of things like:

```json
{
  "123": "/articles/top-10-cats-of-all-time"
}
```

This is available to our runtime component under `Runtime.metadata`, allowing us to write a server-side responder like this:

```js
// server/redirect-old-blog-urls/runtime.js

// We export a default function that takes a 'Runtime' object
// that lets us declare route handlers
export default function BlogRedirectRuntime(Runtime) {

  // Register a handler to match the old posts
  Runtime.on('/posts/:id', async ({ params, request, settings, url }) => {
    // grab the :id off the URL params and look it up in the metadata
    const { id } = params
    const new_article_url = Runtime.metadata.article_urls[id]

    // If the ID matches, we can return a 301 that points to it
    if (new_article_url) {
      return new Response(null, {
        status: 301,
        headers: {
          Location: new_article_url,
        },
      })
    } else {
      // If the :id doesn't match anything we know of, we could render
      // a 404 ourselves here, but we could also just return undefined
      // to let the rest of the FAB runtime handle it.
      return undefined
    }
  })
}
```

To include this in our FAB build, we edit `fab.config.json5` to reference our new plugin directory, which will look for `build.js` and `runtime.js` files within it (see [Plugin resolution]:

```json5
{
  plugins: {
    '@fab/input-static': {},
    './server/redirect-old-articles': {},
    '@fab/plugin-render-html': {},
    // ...
  },
}
```

**Note**: the ordering is important here—our plugin must come _after_ `@fab/input-static` (otherwise the HTML files won't be on `proto_fab.files` yet) and _before_ `@fab/render-html`, since it [compiles HTML files into Markdown templates](https://github.com/fab-spec/fab/tree/master/packages/plugin-render-html) for efficient rendering, which removes them from `proto_fab.files`. These considerations would not apply if we were sourcing the list of article URLs from some other source, for example making a HTTP request to a CMS for the current list.

## Execution environments of Build vs Runtime files

For plugins with both build and runtime effects, we require two separate files `build.js` and `runtime.js` because they're executed in very different ways:

- `build.js` is called by `@fab/cli`, so has access to the full NodeJS ecosystem of tools, and direct access to the filesystem, and can use CLI utilities like `log`, `prompt` or `confirm`, as well as make arbitrary HTTP requests.

  Note: `build.js` needs to be in a format interpretable by your current NodeJS version.

- `runtime.js` is **compiled into the FAB itself** using Rollup. This means it, and its dependencies, _need to be compatible with the [FAB Runtime Environment](/kb/fab-runtime-environment)_, but it also means that ES Modules syntax and/or Typescript are natively supported (although no typechecking takes place, see [below](#using-typescript)).

## Plugin resolution

To avoid having to specify both input files, when a plugin is referenced in the config file, eg:

```json5
{
  plugins: {
    '@fab/some-plugin': {
      /* ... */
    },
  },
}
```

We first look to resolve `@fab/some-plugin/runtime` and `@fab/some-plugin/build`, which are then required and integrated at the relevant stage. If _neither_ of those files exist, we require `@fab/some-plugin` and consider it a runtime-only plugin.

> 👉 Note: most `@fab/xxx` plugins do not have a `main` entry in their `package.json` file, meaning they cannot be required without adding `/build` or `/runtime`. It turns out it's the only good way I could find to have a package on NPM with two separate, yet equally important, entry points. The more you know!

Also note: this works the same with relative path plugins, like `./src/fab-server`:

```json5
{
  plugins: {
    './src/fab-server': {
      /* ... */
    },
  },
}
```

This will "just work" if `src/fab-server` is a directory with `build.js` and/or `runtime.js` inside it, or if it is a file `src/fab-server.js` that only defines runtime behaviour.

Note: There's nothing wrong with referencing both files directly, if you prefer:

```json5
{
  plugins: {
    './src/fab-server/build': {
      /* ... */
    },
    './src/fab-server/runtime': {
      /* ... */
    },
  },
}
```

## Ordering

Plugins are invoked in the order in which they're defined in the `fab.config.json5` file, hence why we need to place our `./server/redirect-old-articles` plugin between `@fab/input-static` and `@fab/plugin-render-html` in our example above.

## Using Typescript

The FAB project is 100% Typescript, so we support defining your plugins in Typescript as well. In the above examples, anywhere `.js` is referenced, a `.ts` file should work as well.

Note: we don't [currently](https://github.com/fab-spec/fab/issues/65) do any typechecking during build, that's up to you. Usually IDE integration is enough to guide you for simple plugins.

See https://github.com/fab-spec/fab/tree/new-runtime-api/packages/actions/test/fixtures/plugins/typescript-example for an example.

> TODO: change that to `master` branch once merged.

## Restrictions

At the moment, the plugin loading system isn't as sophisticated as we'd like it to be. These issues track our progress towards each of them. If there's anything else you're interested in proposing [raise an issue](https://github.com/fab-spec/fab/issues/new).

- [Plugins that use ES Modules or Typescript syntax can't be used for the `build` step](https://github.com/fab-spec/fab/issues/66)
- [Typescript plugins aren't typechecked](https://github.com/fab-spec/fab/issues/65)
- [Runtime plugins aren't checked for validity before being passed to the Compiler](https://github.com/fab-spec/fab/issues/67)

For a given entry in the `plugins` key of your `fab.config.json5` file, e.g.

```json5
{
  plugins: {
    './some-local-file': {
      /*...*/
    },
    '@some-org/package-name': {
      /*...*/
    },
  },
}
```
