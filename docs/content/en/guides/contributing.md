---
title: 'Contributing'
description: 'Contribution guidelines'
category: Guides
position: 206
---

# Contributing

## Documentation

If you can, edit the docs that are there already & send a PR or add a new docs page with your info in it, but if you're not sure where to put it or even if it's relevant to anyone else, simply jot some thoughts/bullet points down in the `docs/wip` directory and send a PR. I'll find a place for it!

### Previewing docs

```sh
# in the FAB project root
cd docs
yarn
yarn dev
```

## E2E Tests

If you're looking to add any code/fix bugs in the core plugins, the most important thing is to _extend the E2E tests to cover them_. There's quite a few unit tests there, and they have definitely helped, but given the nature of the FAB project, it makes more sense to do exactly what a user would do:

- Take a project
- Configure it for FABs
- Serve the FAB and expect some result

### How to run them

In one terminal:

```sh
# in the FAB project root
yarn
yarn build
yarn link-all
yarn build:watch
```

In a second terminal:

```sh
# from the FAB project root
cd tests
yarn
yarn test paths-exist
yarn test server-side-logic
yarn test create-react-app
yarn test nextjs
```

This will first establish whether the local set up is correct, then do some end-to-end tests on FAB server logic (both of which run fairly quickly). But the real tests are running a `create-react-app` and a `nextjs` test suite, where it creates a new project (using CRA or `create-next-app`), then runs `fab init`, then runs `fab build`, then runs `fab serve fab.zip`. It should pass on your machine, if doesn't then raise an issue!

This test is fairly slow, so repeated runs will try to reuse the tmp directory. For example, the first step in the `yarn test create-react-app` is to run `yarn create react-app` which takes a while. Rerunning the E2E tests will `git reset --hard` to the original state, which is much faster than creating a new app.

### Rerunning tests

Note, run these in the `fab/tests` dir.

For `create-react-app`:

```sh
# Reuse the previous CRA if present
yarn test create-react-app

# Full E2E test including new CRA from scratch
FAB_E2E_CLEAN=true yarn test create-react-app

# Or you can do:
rm e2e/workspace/create-react-app
yarn test create-react-app
```

For `nextjs`:

```sh
# Reuse the previous NextJS project if present
yarn test nextjs

# Full E2E test including new NextJS from the base template
FAB_E2E_CLEAN=true yarn test nextjs

# Or you can do:
rm e2e/workspace/nextjs-test
yarn test nextjs
```

### Tweaking tests & source code

Personally, I like to spin up a third console window and `cd` into the `[cra|nextjs]-test` dir and run `fab build` & `fab serve fab.zip` manually, then tweak the source code or config and rerun.

Because you ran `yarn link-all` back in the first terminal window, and because `yarn build:watch` is running in the background, _changes you make to any of the FAB plugins should be instantly available_. If they're not, check the output of `yarn build:watch`, there's probably typescript errors.

Once you have recreated the bug/situation you're interested in, update the tests to automatically change the blank project to your desired state as a separate step after all the others (see the existing tests there, that's how things work already). Then rerun your `FAB_E2E_... yarn test ...` and it should reset your test project and then configure it back to the state you're interested in.

Now you've got your setup, you can add expectations of what should happen to the tests, plus any FAB core code to fix them! Once it passes, fire up a PR and make sure it passes on Github CI as well, then you're done!

## Adding a new plugin

- Pick the closest existing plugin in `packages` and copy it across.
- Find/replace the new name.
- Remove any files/dir not needed (i.e. shims)
- Check package.json that `files` and `dependencies` is right
- Strip back to simple `build.ts`, `render.ts`, `types.ts`
- Run `yarn` in the FAB root.
- Run `yarn build` in the plugin dir. Make sure it works.
- Run `yarn link-all` in the FAB root.
- Restart `yarn build:watch` in FAB root.
- Add the package to `.codesandbox/ci.json` once it's working to test it externally.

## Adding a new framework

- If it needs a new `input-` plugin, do the above first.
- Then add the default `fab.config.json5` config needed to `cli/Initializer/frameworks.ts`
- Then add a `isFrameworkX` function to `cli/Initializer/index.ts` (and remember to call it like the others)
- Add a new E2E test, copy one of the others, just enough to get a repeatable bootstrap of a simple project.
- Skip any kind of `fab init` for the moment, just make sure `yarn link` is run
- Run `yarn test framework-x` in `tests` dir, let it fail.
- Then jump into `tests/e2e/workspaces/framework-x` and start work.

Now (assuming you have `build:watch` running in the background) you should be able:

- Iterate on your `fab init` stuff `npx fab init` should pick up your changes to `@fab/cli` and do the right autodetection. You may need to use `npx fab init -y --skip-install` if you are using unpublished plugins.
- Iterate on your plugins. `npx fab build` should try to compile.
- As things start working, start fleshing out the E2E test to look more like the others (re: `fab init` and `fab build`)
- You can always rerun `fab test framework-x` to reset that workspace dir back to its original state and rerun the tests, or `FAB_E2E_CLEAN=true yarn test framework-x` to create a new tmp dir and create a project from scratch first.
