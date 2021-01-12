# FAB E2E Tests

> See https://fab.dev/guides/contributing#e2e-tests for more info.

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
```

Full E2E framework tests:

```
yarn test create-react-app
yarn test nextjs
```

Use `FAB_E2E_CLEAN=true` when running this to always do a fresh `yarn create` rather than reusing the last run.

> See https://github.com/fab-spec/fab/blob/master/.github/workflows/nodejs.yml for the list of steps & tests run in CI
