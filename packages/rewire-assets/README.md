# @fab/rewire-assets

A plugin for moving any files not handled by another plugin to the `_assets` folder. Usually the last in the sequence.

## Rationale

Since a FAB can only have two components, a `server.js` entry-point and an `_assets` directory (see [FAB Structure](/kb/fab-structure) for more info), any files not handled by other plugins need to moved into place.

There are a few common use-cases:

- Small files with predictable public URLs, e.g. `favicon.ico` or `robots.txt`
- Larger assets that are not properly handled by a build tool e.g. `/public/logo.png`
- Compiled assets that don't follow the `/_assets` naming pattern

This module acts as a catch-all, with different behaviour based on the type of file being processed, or via config.

## Usage

```json5
{
  build: {
    // ... all existing plugins should go here, rewire-assets should be last
    '@fab/rewire-assets': {
      // Can be left blank. See below for config options
    },
  },
  runtime: [
    // ... existing plugins ahead
    '@fab/rewire-assets',
  ],
}
```

## Configuration

By default, this module has the following options:

```json5
{
  'inline-threshold': 8192, // size, in bytes, before a file is inlined
  'treat-as-immutable': '/\\.[0-9A-F]{8,}\\./i', // path to match for immutable assets
}
```

Note: `treat-as-immutable` takes a string that represents a RegExp using [`regex-parser`](https://www.npmjs.com/package/regex-parser) syntax. TL;DR, it's exactly what a literal JS RegExp would look like, with double-escaped backslashes.

### `inline-threshold`

For small files, it's more efficient for the FAB to serve them directly than to upload them to an asset host and fetch them from there. The default value of 8192 bytes is usually big enough for handle favicons, robots.txt & asset manifests, without bloating the `server.js` too substantially.

### `treat-as-immutable`

This RegExp matches files that the FAB should consider as immutable, despite the fact that they're not in the `_assets` directory. In general, FABs assume _all_ files in `_assets` are immutable and all files outside are not, but this option is introduced in order to handle a fairly common use-case: when your files _are_ immutable but _aren't_ in `_assets` yet.

To understand how this works, consider two files, one called `/public/styles.css` and one called `/public/main.a1b2c3d4.js`. For the CSS file, since the public URL has no content hash (also called a fingerprint), the FAB has no way of knowing how long it is safe to cache that file for.

For the JS file, since Webpack or similar has injected an 8-hex-digit content hash into the filename, any revisions to the content will result in a new URL, so this file can be cached indefinitely, just like files already in `_assets`.

The default is for any files that have at least 8 hex-only digits between two `.` chars, matching the common convention of `/path/to/filename.[hash].type`

## How it works

Each file that isn't inlined is hashed, then moved into the `_assets` directory. When a request for the original path comes in, the FAB fetches the moved file and serves it, altering the cache headers as required.
