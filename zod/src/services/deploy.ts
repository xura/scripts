import 'reflect-metadata'
import { autoInjectable, inject } from 'tsyringe'
import { Cdn } from '../interfaces/cdn'
import { Environment } from '../interfaces/config'
import { Docker } from '../interfaces/docker';
import { retry } from 'async';
import { promise } from 'ping';

export const DEPLOY_ERRORS = {
  PROPERTY_NOT_INJECTED: (property: string) => (`${property} adapter not injected properly`),
}

@autoInjectable()
export default class {
  constructor(
    @inject('Cdn') private _cdn?: Cdn,
    @inject('Docker') private _docker?: Docker
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

    // TODOs
    // [X] devise way of creating a single page app container on xura.io
    // [ ] develop command to create spa container:
    //      [X] upload single index.html file (path/github link passed in through args)
    //      [X] set correct subdomain and lets-encrypt domain
    //      [X] set correct docker network
    //      [ ] ensure certs are being created, do we need DNS integration? --> this seems to work, ran into a rate limit with lets encrypt
    // [ ] ping staging URL until it is reachable
    //      [ ] create ping service
    // [ ] develop command to remove spa container:
    //      [ ] Remove staging htdocs for version
    //      [ ] Remove container instance
    //      [ ] Remove certs from nginx/certs folder
    // [ ] output new staging url to console

    //return this._docker.createSpaContainer(tag);
    retry({
      times: 10,
      interval: (retryCount) => {
        console.log(retryCount)
        return 10
      }
    }, async () => {
      if (!(await promise.probe('3f3f3rf.com')).alive) {
        throw Error('Ping failed');
      }
      return true;
    }, function (err, result) {
      // do something with the result
    });

    return Promise.reject([false, `${tag} could not be resolved`])
  }
}
