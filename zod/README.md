zod
===



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/zod.svg)](https://npmjs.org/package/zod)
[![Downloads/week](https://img.shields.io/npm/dw/zod.svg)](https://npmjs.org/package/zod)
[![License](https://img.shields.io/npm/l/zod.svg)](https://github.com/joe307bad/https://github.com/xura/scripts/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g zod
$ zod COMMAND
running command...
$ zod (-v|--version|version)
zod/0.0.0 darwin-x64 node-v10.16.0
$ zod --help [COMMAND]
USAGE
  $ zod COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zod deploy:clean ENV [KEEP]`](#zod-deployclean-env-keep)
* [`zod help [COMMAND]`](#zod-help-command)

## `zod deploy:clean ENV [KEEP]`

remove all but stickied and the most recent 3 (or provided) deployments

```
USAGE
  $ zod deploy:clean ENV [KEEP]

ARGUMENTS
  ENV   environment to clean up
  KEEP  [default: 3] keep this many deployments sorted by deployment date (last modified)

OPTIONS
  -h, --help  how do I clean the phantom zone!

EXAMPLE
  $ zod deploy:clean --env=staging
```

_See code: [src/commands/deploy/clean.ts](https://github.com/xura/scripts/blob/v0.0.0/src/commands/deploy/clean.ts)_

## `zod help [COMMAND]`

display help for zod

```
USAGE
  $ zod help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_
<!-- commandsstop -->
