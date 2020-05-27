---
title: 'Getting Started'
description: 'Getting Started with FABs'
category: Guides
position: 201
---

# Getting Started with FABs

FABs are a [special zip file](/kb/fab-structure) that contains a complete snapshot of your application: all your server-side code, all your client-side assets, and it can be deployed [anywhere that runs JS](/guides/deploying).

## `fab init`

You can configure a repository to build a FAB by running `npx fab init` in the repo:

```sh
npx fab init
```

The following frameworks are supported:

* Create React App
* NextJS 9+

Anything else will be treated as a "static" build i.e. a project with no server-side component. It'll look for a command like `npm run build` to generate a directory like `build`, `dist` or `public`, which should cover everything from Angular to Vue to Gatsby. But as always, [leave an issue](https://github.com/fab-spec/fab/issues) if something you think _should_ happen _doesn't_ happen.

## `fab build`

`fab init` will add `build:fab` and `fab:build` scripts to your `package.json`, but both of them call `fab build` under the hood.

```sh
# runs npm run build, then builds the FAB
yarn build:fab
npm run build:fab

# alias for fab build, below
yarn fab:build
npm run fab:build

# generates a FAB according to your fab.config.json5
fab build
```

If it works, you should get a `fab.zip` file output.

## `fab serve`

```sh
fab serve fab.zip
fab serve fab.zip --port=3001
```

Runs your FAB in a local NodeJS Express server.

## `fab deploy`

```sh
fab deploy
```

Will prompt you for your Cloudflare workers & Amazon S3 info and deploy your FAB!

