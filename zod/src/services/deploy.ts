import { autoInjectable, inject } from 'tsyringe';
import { ICdn } from '../interfaces/cdn';
import { Environment } from '../interfaces/config';

export const DEPLOY_ERRORS = {
    PROPERTY_NOT_INJECTED: (property: string) => (`${property} adapter not injected properly`)
}

@autoInjectable()
export default class {
    constructor(@inject('ICdn') private cdn?: ICdn) { }

    clean(keep: string, env: Environment): Promise<[boolean, string]> {
        if (!this.cdn) {
            return Promise.reject([false, DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('cdn')])
        }

        return this.cdn.clean(+keep, env);
    }
}