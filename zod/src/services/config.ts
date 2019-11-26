import {Config, ConfigKey} from '../interfaces/config'

export default class implements Config {
  get(key: ConfigKey): string {
    return process.env[key] || 'ENV_VARIABLE_NOT_FOUND'
  }
}
