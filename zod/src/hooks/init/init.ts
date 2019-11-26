import 'reflect-metadata'

import Spaces from '../../adapters/cdn/spaces'
import Config from '../../services/config'
import {container} from 'tsyringe'
import {Hook} from '@oclif/config'

const fs = require('fs')
const path = require('path')

const envFile = path.resolve(path.join(__dirname, '/../../../.env'))

if (!fs.existsSync(envFile)) {
  throw new Error("You're missing the .env file")
}

require('dotenv').config({
  path: envFile,
})

const hook: Hook<'init'> = function () {
  container.register('Config', Config)
  container.register('Cdn', Spaces)
}

export default hook
