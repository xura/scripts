import 'reflect-metadata'
import { autoInjectable, inject } from 'tsyringe'
import { Cdn } from '../interfaces/cdn'
import { Environment } from '../interfaces/config'
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import path from 'path';

export const DEPLOY_ERRORS = {
  PROPERTY_NOT_INJECTED: (property: string) => (`${property} adapter not injected properly`),
}

@autoInjectable()
export default class {
  constructor(@inject('Cdn') private cdn?: Cdn) { }

  clean(keep: string, env: Environment): Promise<[boolean, string]> {
    if (!this.cdn) {
      return Promise.reject([false, DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('cdn')])
    }

    return this.cdn.clean(Number(keep), env)
  }

  async createStagingUrl(tag: string): Promise<[boolean, string]> {

    // TODOs
    // create container on staging server
    // ping staging URL until it is reachable
    // build link to 

    // TODOs
    // create docker service
    // create service that pings a url until its reachable

    const ansibleDir = path.resolve(path.join(__dirname, '../core/ansible'))
    const options = new Options(ansibleDir);

    const ansiblePlaybook = new AnsiblePlaybook(options);

    const data = await ansiblePlaybook.command('create-staging-url.yml -i xura');


    return Promise.resolve([true, 'Staging URL created']);
  }
}
