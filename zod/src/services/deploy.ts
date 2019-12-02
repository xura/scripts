import 'reflect-metadata'
import { autoInjectable, inject } from 'tsyringe'
import { Cdn } from '../interfaces/cdn'
import { Environment } from '../interfaces/config'
import { Docker } from '../interfaces/docker';

export const DEPLOY_ERRORS = {
  PROPERTY_NOT_INJECTED: (property: string) => (`${property} adapter not injected properly`),
}

@autoInjectable()
export default class {
  constructor(
    @inject('Cdn') private _cdn?: Cdn,
    @inject('Docker') private _docker?: Docker
  ) { }

  clean = (keep: string, env: Environment): Promise<[boolean, string]> => {
    if (!this._cdn) {
      return Promise.reject([false, DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('cdn')])
    }

    return this._cdn.clean(Number(keep), env)
  }

  async createStagingUrl(tag: string): Promise<[boolean, string]> {
    if (!this._docker) {
      return Promise.reject([false, DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('docker')])
    }

    // TODOs
    // [X] devise way of creating a single page app container on xura.io
    // [ ] set correct settings for newly created SPA container:
    //      [X] upload single index.html file (path/github link passed in through args)
    //      [X] set correct subdomain and lets-encrypt domain
    //      [X] set correct docker network
    //      [ ] ensure certs are being created, do we need DNS integration?
    // [ ] ping staging URL until it is reachable
    // [ ] develop command to remove spa container
    // [ ] output new staging url to console

    const container = await this._docker.createSpaContainer(tag);

    return Promise.resolve([true, 'Staging URL created']);
  }
}
