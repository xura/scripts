import 'reflect-metadata'

import Ansible from '../../adapters/docker/ansible'
import Spaces from '../../adapters/cdn/spaces'
import Config from '../../adapters/config'
import Ping from '../../adapters/ping'
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

export const inject = () => {
  container.register('Config', Config)
  container.register('Cdn', Spaces)
  container.register('Docker', Ansible)
  container.register('Ping', Ping)
}

const hook: Hook<'init'> = function () {
  inject()
}

export default hook
