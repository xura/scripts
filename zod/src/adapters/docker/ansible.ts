import { Docker } from '../../interfaces/docker';
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import path from 'path';
import { inject } from 'tsyringe';
import { Config } from '../../interfaces/config';

export default class implements Docker {

    private _project: string = this._config.get('PROJECT');
    private _playbook = new AnsiblePlaybook(
        new Options(path.resolve(path.join(__dirname, '../../core/ansible')))
    );

    constructor(@inject('Config') private _config: Config) { }

    async createSpaContainer(name: string): Promise<[boolean, string]> {
        const containerName = `${name}.${this._project}.staging.xura.io`;
        const ansibleExtraVars = {
            containerName,
        };
        const playbookResponse = await this._playbook.command('create-staging-url.yml -i xura')
        return Promise.resolve([true, playbookResponse])
    }
}