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
