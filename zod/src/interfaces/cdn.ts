import { Environment } from './config';

export interface ICdn {
    clean(keep: number, env: Environment): Promise<[boolean, string]>;
}