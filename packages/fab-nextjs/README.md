---
name: "@fab/nextjs"
route: "/packages/fab-nextjs"
menu: Packages
---

# 💎 @fab/static

Builds a NextJS9+ app into a FAB.

NextJS is a tricky target for FABs, as it, like a lot of NodeJS server-side JS projects, assumes a fair bit about the environment it runs on. Since version 8, Next has offered two build targets: NodeJS & Serverless. The serverless build has stripped out a lot of the old assumptions and generates a single file per "route" for NextJS. Each of these files shares a lot with each other, so `@fab/nextjs` merges these and wraps them in a FAB adapter, so that you end up with a single-file entry point.

In version 9, [path-based Dynamic Routing](https://github.com/zeit/next.js#dynamic-routing) was added, removing a lot of the need for a custom server. This makes `@fab/nextjs` a lot simpler, so we recommend upgrading to Next 9 first.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@fab/nextjs.svg)](https://npmjs.org/package/@fab/nextjs)
[![Downloads/week](https://img.shields.io/npm/dw/@fab/nextjs.svg)](https://npmjs.org/package/@fab/nextjs)
[![License](https://img.shields.io/npm/l/@fab/nextjs.svg)](https://github.com/fab-spec/fab/blob/master/package.json)

## Getting Started

Install `@fab/nextjs` as a development dependency:

```
yarn add --dev @fab/static
npm install --dev @fab/static
```

Ensure you're on the `serverless` build target, and we recommend using an `assetPrefix` of `/_assets`:

```js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  target: 'serverless',
  assetPrefix: isProd ? '/_assets' : ''
}
```

> See [this issue](https://github.com/zeit/next.js/issues/8605) as to why `isProd` is needed

Add scripts to your `package.json`:

```diff
  "scripts": {
    "build": "[your existing build step]",
+   "build:fab": "npm run build && npm run fab:compile",
+   "fab:compile": "fab-nextjs build"
  }
```

We've added two scripts here, `fab:compile` which runs the `fab-static` builder, and `build:fab` that builds the project first. Most of the time, and especially you're using a FAB-enabled platform like [linc.sh](https://linc.sh), you'll mostly run `build:fab`, but having a separate `fab:compile` step can be handy as you set things up.

You can test it out by running: 

```
npm run build:fab
```

Once this is complete, you should have a `fab.zip` file (and a `.fab` directory with a bunch of build files). Those don't need to be checked in to your repository, so you can add them to your `.gitignore` file with this one-liner:

```
echo "\n.fab\nfab.zip" >> .gitignore
```

If you want to spin up your `fab.zip` file locally, you can use [**@fab/serve**](./fab-serve). You can either install it globally:

```
yarn global add @fab/serve
npm install --global @fab/serve

fab-serve fab.zip
``` 

Or use the awesome [**npx**](https://www.npmjs.com/package/npx) (which is bundled with NodeJS) to run a command-line NPM package without needing to install it:

```
npx @fab/serve fab.zip
```

You should see your app running on `http://localhost:3000`!

Note: this process will add one file `fab.zip` and one directory `.fab` into your project. 

## Usage

`@fab/static` takes the following options:

```
USAGE
  $ fab-nextjs build

OPTIONS
  -h, --help                     show CLI help
  -o, --output=output            [default: fab.zip] Output FAB file
  -s, --server=server            Path to server entry file
  -v, --version                  show CLI version
  -w, --working-dir=working-dir  [default: .fab] Working FAB directory
  --intermediate-only

EXAMPLE
  $ fab-nextjs build
```
