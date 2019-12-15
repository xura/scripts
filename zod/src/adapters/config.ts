import 'reflect-metadata'
import {Config, ConfigKey} from '../interfaces/config'

export const ENV_VARIABLE_NOT_FOUND = 'ENV_VARIABLE_NOT_FOUND'

export default class implements Config {
  get(key: ConfigKey): string {
    return process.env[key] || ENV_VARIABLE_NOT_FOUND
  }
}
