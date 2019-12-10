zod
===



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
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
zod/1.0.0 darwin-x64 node-v10.16.0
$ zod --help [COMMAND]
USAGE
  $ zod COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`zod deploy:clean ENV [KEEP]`](#zod-deployclean-env-keep)
* [`zod deploy:create TAG`](#zod-deploycreate-tag)
* [`zod help [COMMAND]`](#zod-help-command)

## `zod deploy:clean ENV [KEEP]`

remove all but stickied and the most recent 3 (or provided) deployments

```
USAGE
  $ zod deploy:clean ENV [KEEP]

ARGUMENTS
  ENV   environment to clean up
  KEEP  [default: 1] keep this many deployments sorted by deployment date (last modified)

OPTIONS
  -h, --help  how do I clean the phantom zone!

EXAMPLE
  $ zod deploy:clean staging 3
```

_See code: [src/commands/deploy/clean.ts](https://github.com/xura/scripts/blob/v1.0.0/src/commands/deploy/clean.ts)_

## `zod deploy:create TAG`

create a deployment named after the given tag

```
USAGE
  $ zod deploy:create TAG

ARGUMENTS
  TAG  tag to use to name the container and connect it to a subdomain

OPTIONS
  -h, --help  how do I deploy a Kryptonian container

EXAMPLE
  $ zod deploy:create v0.0.24
```

_See code: [src/commands/deploy/create.ts](https://github.com/xura/scripts/blob/v1.0.0/src/commands/deploy/create.ts)_

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
