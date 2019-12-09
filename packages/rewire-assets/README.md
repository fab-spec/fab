---
name: '@fab/rewire-assets'
route: '/plugins/rewire-assets'
menu: Plugins
---

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
      // No config required, see below for defaults
    },
  },
}
```

## Configuration

By default, this module has the following options:

```json5
{
  'inline-threshold': 1024, // size, in bytes, before a file is inlined
  'treat-as-immutable': '/\\.[0-9A-F]{8,}/i' /* RegExp in string format parsed by
                                                regex-parser for identifying which
                                                files to serve with immutagble cache
                                                headers */,
}
```
