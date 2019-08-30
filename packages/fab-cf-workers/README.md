@fab/cf-workers
===============

FAB releaser for Cloudflare Workers

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@fab/cf-workers.svg)](https://npmjs.org/package/@fab/cf-workers)
[![Downloads/week](https://img.shields.io/npm/dw/@fab/cf-workers.svg)](https://npmjs.org/package/@fab/cf-workers)
[![License](https://img.shields.io/npm/l/@fab/cf-workers.svg)](https://github.com/fab-spec/fab/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @fab/cf-workers
$ fab-cf-workers COMMAND
running command...
$ fab-cf-workers (-v|--version|version)
@fab/cf-workers/0.0.1 darwin-x64 node-v12.6.0
$ fab-cf-workers --help [COMMAND]
USAGE
  $ fab-cf-workers COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fab-cf-workers deploy [FILE]`](#fab-cf-workers-deploy-file)
* [`fab-cf-workers help [COMMAND]`](#fab-cf-workers-help-command)

## `fab-cf-workers deploy [FILE]`

describe the command here

```
USAGE
  $ fab-cf-workers deploy [FILE]

OPTIONS
  -c, --config=config            [default: fab.config.json] Path to config file
  -h, --help                     show CLI help
  -n, --name=name                Name for project
  --aws_key=aws_key              AWS Key for S3 upload (if not using ~/.fab/global.config.json)
  --aws_secret=aws_secret        AWS Secret Key for S3 upload (if not using ~/.fab/global.config.json)
  --cf_account_id=cf_account_id  Cloudflare Workers Account ID (if not using ~/.fab/global.config.json)
  --cf_api_key=cf_api_key        Cloudflare Workers API key (if not using ~/.fab/global.config.json)
  --cf_email=cf_email            Cloudflare Workers Account Email (if not using ~/.fab/global.config.json)
  --s3_bucket=s3_bucket          S3 Bucket name for asset upload

EXAMPLE
  $ fab-cf-workers deploy fab.zip
```

_See code: [src/commands/deploy.ts](https://github.com/fab-spec/fab/blob/v0.0.1/src/commands/deploy.ts)_

## `fab-cf-workers help [COMMAND]`

display help for fab-cf-workers

```
USAGE
  $ fab-cf-workers help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
