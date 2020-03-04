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
@fab/cli/0.0.7-alpha.10 darwin-x64 node-v13.8.0
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
- [`fab serve [FILE]`](#fab-serve-file)

## `fab build`

Generate a FAB given the config (usually in fab.config.json5)

```
USAGE
  $ fab build

OPTIONS
  -c, --config=config  [default: fab.config.json5] Path to config file
  -h, --help           show CLI help

EXAMPLES
  $ fab build
  $ fab build --config=fab.config.json5
```

_See code: [lib/commands/build.js](https://github.com/fab-spec/fab/blob/v0.0.7-alpha.10/lib/commands/build.js)_

## `fab deploy [FILE]`

Command line deployer for FABs

```
USAGE
  $ fab deploy [FILE]

OPTIONS
  -c, --config=config                    [default: fab.config.json5] Path to local config file
  -h, --help                             show CLI help
  -n, --cf_workers_name=cf_workers_name  Name for project. Will deploy to https://{name}.{your_cf_username}.workers.dev
  --aws_key=aws_key                      AWS Key for S3 upload (if not using ~/.fab/global.config.json5)
  --aws_secret=aws_secret                AWS Secret Key for S3 upload (if not using ~/.fab/global.config.json5)
  --cf_account_id=cf_account_id          Cloudflare Workers Account ID (if not using ~/.fab/global.config.json5)
  --cf_api_key=cf_api_key                Cloudflare Workers API key (if not using ~/.fab/global.config.json5)
  --cf_email=cf_email                    Cloudflare Workers Account Email (if not using ~/.fab/global.config.json5)
  --s3_asset_bucket=s3_asset_bucket      S3 Bucket name for asset upload

EXAMPLE
  $ fab-cf-workers deploy fab.zip
```

_See code: [lib/commands/deploy.js](https://github.com/fab-spec/fab/blob/v0.0.7-alpha.10/lib/commands/deploy.js)_

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

Generate a FAB config on a new project

```
USAGE
  $ fab init

OPTIONS
  -c, --config=config  [default: fab.config.json5] Config filename
  -h, --help           show CLI help
  -y, --yes            Assume yes to all prompts (must be in the root directory of a project)
  --skip-install       Do not attempt to npm install anything
  --version=version    What NPM version or dist-tag to use for installing FAB packages

EXAMPLES
  $ fab init
  $ fab init --config=fab.config.json5
```

_See code: [lib/commands/init.js](https://github.com/fab-spec/fab/blob/v0.0.7-alpha.10/lib/commands/init.js)_

## `fab serve [FILE]`

fab serve: Serve a FAB in a local NodeJS Express server

```
USAGE
  $ fab serve [FILE]

OPTIONS
  -c, --config=config        [default: fab.config.json5] Path to config file. Only used for SETTINGS in conjunction with
                             --env.

  -h, --help                 show CLI help

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

_See code: [lib/commands/serve.js](https://github.com/fab-spec/fab/blob/v0.0.7-alpha.10/lib/commands/serve.js)_

<!-- commandsstop -->
