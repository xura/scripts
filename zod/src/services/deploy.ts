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
    @inject('Cdn') private cdn: Cdn,
    @inject('Docker') private docker: Docker
  ) { }

  clean = (keep: string, env: Environment): Promise<[boolean, string]> => this.cdn.clean(Number(keep), env)

  async createStagingUrl(tag: string): Promise<[boolean, string]> {

    // TODOs
    // [X] devise way of creating a single page app container on xura.io
    // [ ] set correct settings for newly created SPA container:
    //      [ ] upload single index.html file (path/github link passed in through args)
    //      [ ] set correct subdomain and lets-encrypt domain
    //      [ ] set correct docker network
    // [ ] ping staging URL until it is reachable
    // [ ] output new staging url to console

    const container = await this.docker.createSpaContainer(
      tag.replace(/./g, '')
    );

    return Promise.resolve([true, 'Staging URL created']);
  }
}
