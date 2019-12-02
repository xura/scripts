import { Docker } from '../../interfaces/docker';
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js';
import path from 'path';

export default class implements Docker {

    private _playbook = new AnsiblePlaybook(
        new Options(path.resolve(path.join(__dirname, '../../core/ansible')))
    );

    async createSpaContainer(): Promise<[boolean, string]> {
        const playbookResponse = await this._playbook.command('create-staging-url.yml -i xura')
        return Promise.resolve([true, playbookResponse])
    }
}