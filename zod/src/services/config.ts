import { IConfig, ConfigKey } from "../interfaces/config";

export default class implements IConfig {
    get(key: ConfigKey): string {
        return process.env[key] || 'ENV_VARIABLE_NOT_FOUND';
    }
}