# FAB Command Line Interface

`fab`: the CLI entry-point for the FAB ecosystem

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@fab/cli.svg)](https://npmjs.org/package/@fab/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@fab/cli.svg)](https://npmjs.org/package/@fab/cli)
[![License](https://img.shields.io/npm/l/@fab/cli.svg)](https://github.com/fab-spec/fab/blob/master/package.json)

<!-- toc -->

- [FAB Command Line Interface](#fab-command-line-interface)
  <!-- tocstop -->

## Usage

<!-- usage -->

```sh-session
$ npm install -g @fab/cli
$ fab COMMAND
running command...
$ fab (-v|--version|version)
@fab/cli/0.1.6-alpha.0 darwin-x64 node-v13.12.0
$ fab --help [COMMAND]
USAGE
  $ fab COMMAND
...
```

<!-- usagestop -->

## Commands

<!-- commands -->

- [`fab build`](#fab-build)
- [`fab deploy [FILE]`](#fab-deploy-file)
- [`fab help [COMMAND]`](#fab-help-command)
- [`fab init`](#fab-init)
- [`fab package [FILE]`](#fab-package-file)
- [`fab serve [FILE]`](#fab-serve-file)

## `fab build`

Generate a FAB given the config (usually in fab.config.json5)

```
USAGE
  $ fab build

OPTIONS
  -c, --config=config  [default: fab.config.json5] Path to config file
  -h, --help           show CLI help
  --skip-cache         Skip any caching of intermediate build artifacts

EXAMPLES
  $ fab build
  $ fab build --config=fab.config.json5
```

_See code: [lib/commands/build.js](https://github.com/fab-spec/fab/blob/v0.1.6-alpha.0/lib/commands/build.js)_

## `fab deploy [FILE]`

Deploy a FAB to a hosting provider

```
USAGE
  $ fab deploy [FILE]

OPTIONS
  -c, --config=config                                      [default: fab.config.json5] Path to config file
  -h, --help                                               show CLI help

  --assets-already-deployed-at=assets-already-deployed-at  Skip asset deploys and only deploy the server component
                                                           pointing at this URL for assets

  --assets-host=(cf-workers|aws-lambda-edge|aws-s3)        If you have multiple potential hosts for the assets defined
                                                           in your fab.config.json5, which one to deploy to.

  --assets-only                                            Skip server deploy, just upload assets

  --auto-install                                           If you need dependent packages (e.g. @fab/deploy-*), install
                                                           them without prompting

  --env=env                                                Override production settings with a different environment
                                                           defined in your FAB config file.

  --package-dir=package-dir                                Where to save the packaged FAB files (default .fab/deploy)

  --server-host=(cf-workers|aws-lambda-edge|aws-s3)        If you have multiple potential hosts for the server defined
                                                           in your fab.config.json5, which one to deploy to.

EXAMPLE
  $ fab deploy fab.zip
```

_See code: [lib/commands/deploy.js](https://github.com/fab-spec/fab/blob/v0.1.6-alpha.0/lib/commands/deploy.js)_

## `fab help [COMMAND]`

display help for fab

```
USAGE
  $ fab help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `fab init`

Auto-configure a repo for generating FABs

```
USAGE
  $ fab init

OPTIONS
  -c, --config=config         [default: fab.config.json5] Config filename
  -h, --help                  show CLI help
  -y, --yes                   Assume yes to all prompts (must be in the root directory of a project)
  --skip-framework-detection  Don't try to auto-detect framework, set up manually.
  --skip-install              Do not attempt to npm install anything
  --version=version           What NPM version or dist-tag to use for installing FAB packages

EXAMPLES
  $ fab init
  $ fab init --config=fab.config.json5
```

_See code: [lib/commands/init.js](https://github.com/fab-spec/fab/blob/v0.1.6-alpha.0/lib/commands/init.js)_

## `fab package [FILE]`

Package a FAB to be uploaded to a hosting provider manually

```
USAGE
  $ fab package [FILE]

OPTIONS
  -c, --config=config                               [default: fab.config.json5] Path to config file
  -h, --help                                        show CLI help

  -t, --target=(cf-workers|aws-lambda-edge|aws-s3)  Hosting provider (must be one of: cf-workers, aws-lambda-edge,
                                                    aws-s3)

  --assets-url=assets-url                           A URL for where the assets can be accessed, for server deployers
                                                    that need it

  --env=env                                         Override production settings with a different environment defined in
                                                    your FAB config file.

  --output-path=output-path                         Where to save the packaged FAB (default .fab/deploy/[target].zip)

EXAMPLE
  $ fab package --target=aws-lambda-edge fab.zip
```

_See code: [lib/commands/package.js](https://github.com/fab-spec/fab/blob/v0.1.6-alpha.0/lib/commands/package.js)_

## `fab serve [FILE]`

fab serve: Serve a FAB in a local NodeJS Express server

```
USAGE
  $ fab serve [FILE]

OPTIONS
  -c, --config=config        [default: fab.config.json5] Path to config file. Only used for SETTINGS in conjunction with
                             --env.

  -h, --help                 show CLI help

  --auto-install             If you need dependent packages (e.g. @fab/serve), install them without prompting

  --cert=cert                SSL certificate to use

  --env=env                  Override production settings with a different environment defined in your FAB config file.

  --experimental-v8-sandbox  Enable experimental V8::Isolate Runtime (in development, currently non-functional)

  --key=key                  Key for the SSL Certificate

  --port=port                (required) [default: 3000] Port to use

EXAMPLES
  $ fab serve fab.zip
  $ fab serve --port=3001 fab.zip
  $ fab serve --cert=local-ssl.cert --key=local-ssl.key fab.zip
  $ fab serve --env=staging fab.zip
```

_See code: [lib/commands/serve.js](https://github.com/fab-spec/fab/blob/v0.1.6-alpha.0/lib/commands/serve.js)_

<!-- commandsstop -->
