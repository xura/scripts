import { Docker } from '../../interfaces/docker';
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import path from 'path';
import { inject, autoInjectable } from 'tsyringe';
import { Config } from '../../interfaces/config';

@autoInjectable()
export default class implements Docker {

    private _project: string = this._config.get('PROJECT')
    private _playbook = new AnsiblePlaybook(
        new Options(path.resolve(path.join(__dirname, '../../core/ansible')))
    );

    constructor(@inject('Config') private _config: Config) { }

    async createSpaContainer(name: string): Promise<[boolean, string]> {

        const containerName = `${name.replace(/\./g, '')}.${this._project}.staging.xura.io`;
        const stagingHtdocs = `${this._config.get('STAGING_HTDOCS')}/${this._project}/${name}`
        const indexHtmlCdnUrl = `https://cdn.xura.io/staging/${this._project}/${name}/index.html`;

        const ansibleExtraVars = JSON.stringify({
            containerName,
            stagingHtdocs,
            indexHtmlCdnUrl,
            network: this._config.get('STAGING_DOCKER_NETWORK')
        });
        const command = `create-staging-url.yml -i xura --extra-vars '${ansibleExtraVars}'`;

        const playbookResponse = await this._playbook.command(command)
        return Promise.resolve([true, playbookResponse])
    }
}