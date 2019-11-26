import {Environment} from './config'

export interface Cdn {
    clean(keep: number, env: Environment): Promise<[boolean, string]>;
}
