import * as path from "path";
const { build } = require('gluegun');
require('dotenv').config({
  path: path.resolve(__dirname + '/../.prod.env')
});
import 'reflect-metadata'
import {container} from 'tsyringe'
import Spaces from './adapters/spaces/spaces'

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  container.register('ICdnDeploy', {
    useClass: Spaces
  });

  // create a CLI runtime
  const cli = build()
    .brand('hermes')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'hermes-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create();
  // enable the following method if you'd like to skip loading one of these core extensions
  // this can improve performance if they're not necessary for your project:
  // .exclude(['meta', 'strings', 'print', 'filesystem', 'semver', 'system', 'prompt', 'http', 'template', 'patching'])
  // and run it
  // send it back (for testing, mostly)
  return await cli.run(argv)
}

module.exports = { run }
