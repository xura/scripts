import "reflect-metadata";

import Spaces from './adapters/cdn/spaces';
import { container } from "tsyringe";

container.register('ICdn', Spaces)