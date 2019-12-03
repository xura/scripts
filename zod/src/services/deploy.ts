import 'reflect-metadata'
import { autoInjectable, inject } from 'tsyringe'
import { Cdn } from '../interfaces/cdn'
import { Environment } from '../interfaces/config'
import { Docker } from '../interfaces/docker';
import { Ping } from '../interfaces/ping';

export const DEPLOY_ERRORS = {
  PROPERTY_NOT_INJECTED: (property: string) => (`${property} adapter not injected properly`),
}

@autoInjectable()
export default class {
  constructor(
    @inject('Cdn') private _cdn?: Cdn,
    @inject('Docker') private _docker?: Docker,
    @inject('Ping') private _ping?: Ping
  ) { }

  clean(keep: string, env: Environment): Promise<[boolean, string]> {
    if (!this._cdn) {
      return Promise.reject([false, DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('cdn')])
    }

    return this._cdn.clean(Number(keep), env)
  }

  async createStagingUrl(tag: string): Promise<[boolean, string]> {
    if (!this._docker) {
      return Promise.reject([false, DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('docker')])
    }

    // [ ] develop command to remove spa container:
    //      [ ] Remove staging htdocs for version
    //      [ ] Remove container instance
    //      [ ] Remove certs from nginx/certs folder

    return this._docker.createSpaContainer(tag);
  }

  ping(site: string): Promise<[boolean, string]> {
    if (!this._ping) {
      return Promise.reject([false, DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('ping')])
    }

    return this._ping.check(site, 10, 6000);
  }
}
