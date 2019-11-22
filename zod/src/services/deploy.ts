import { autoInjectable, inject } from 'tsyringe';
import { ICdn } from '../interfaces/cdn';

@autoInjectable()
export default class {
    constructor(@inject('ICdn') private cdn?: ICdn) { }

    upload(): Promise<[boolean, string]> {
        if (!this.cdn) {
            return Promise.resolve([false, "Cdn not injected"]);
        }

        return this.cdn.upload();
    }
}