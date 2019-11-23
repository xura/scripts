import { autoInjectable, inject } from 'tsyringe';
import { ICdn } from '../interfaces/cdn';

@autoInjectable()
export default class {
    constructor(@inject('ICdn') private cdn?: ICdn) { }

    clean(keep: string): Promise<[boolean, string]> {
        if (!this.cdn) {
            return Promise.reject([false, 'CDN adapter not injected properly'])
        }

        return this.cdn.clean(+keep);
    }
}