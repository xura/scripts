import { autoInjectable, inject } from 'tsyringe';
import { ICdn } from '../interfaces/cdn';
import { Environment } from '../interfaces/config';

@autoInjectable()
export default class {
    constructor(@inject('ICdn') private cdn?: ICdn) { }

    clean(keep: string, env: Environment): Promise<[boolean, string]> {
        if (!this.cdn) {
            return Promise.reject([false, 'CDN adapter not injected properly'])
        }

        return this.cdn.clean(+keep, env);
    }
}