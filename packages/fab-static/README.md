---
name: "@fab/static"
route: "/packages/fab-static"
menu: Packages
---

# 💎 @fab/static

Build a FAB from a directory of static HTML and assets, with an optional server-side component

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)&nbsp;
[![Version](https://img.shields.io/npm/v/@fab/static.svg)](https://npmjs.org/package/@fab/static)&nbsp;
[![Downloads/week](https://img.shields.io/npm/dw/@fab/static.svg)](https://npmjs.org/package/@fab/static)&nbsp;
[![License](https://img.shields.io/npm/l/@fab/static.svg)](https://github.com/fab-spec/fab/blob/master/package.json)&nbsp;

## Usage

Install as a development dependency:

```
yarn add --dev @fab/static
npm install --dev @fab/static
```

Add a `build:fab` step to  your project

```diff
  "scripts": {
+   "build:fab": "npm run build && fab-static .docz/dist",
    "build": "[your existing build step]"
  },
}
