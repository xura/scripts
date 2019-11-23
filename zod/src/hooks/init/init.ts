import "reflect-metadata";

import Spaces from '../../adapters/cdn/spaces';
import { container } from "tsyringe";
import { Hook } from '@oclif/config'

const fs = require('fs')
const path = require('path');

const envFile = path.resolve(__dirname + '/../../../.prod.env');

if (!fs.existsSync(envFile)) {
  throw new Error("You're missing the .prod.env file");
}

require('dotenv').config({
  path: envFile
});

const hook: Hook<'init'> = function (opts) {
  container.register('ICdn', Spaces)
}

export default hook
