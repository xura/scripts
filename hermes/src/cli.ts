import * as path from 'path'

const { build } = require('gluegun')
const fs = require('fs')
import 'reflect-metadata'
import { container } from 'tsyringe'
import Spaces from './adapters/spaces'
import { cdnMock } from './services/deploy/cdn/cdn.mock'

const envFile = path.resolve(__dirname + '/../.prod.env');

if (!fs.existsSync(envFile)) {
  throw new Error("You're missing the .prod.env file");
}

require('dotenv').config({
  path: envFile
});

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  const injections = (() => {
    const instances = {
      development: {
        ICdnDeploy: { useValue: cdnMock() }
      },
      production: {
        ICdnDeploy: { useClass: Spaces }
      }
    }
    return instances[process.env.NODE_ENV]
  })()

  container.register('ICdnDeploy', injections.ICdnDeploy)



  const cli = build()
    .brand('hermes')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'hermes-*', hidden: true })
    .help()
    .version()
    .create()

  return cli.run(argv)
}

module.exports = { run }
