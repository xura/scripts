import "reflect-metadata";

import Spaces from '../../adapters/cdn/spaces';
import { container } from "tsyringe";
import { Hook } from '@oclif/config'

const hook: Hook<'init'> = function (opts) {
  container.register('ICdn', Spaces)
}

export default hook
