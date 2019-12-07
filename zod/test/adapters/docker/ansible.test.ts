import 'reflect-metadata'
import sinon from 'sinon'
import { AnsiblePlaybook } from 'ansible-playbook-cli-js'

import Ansible from '../../../src/adapters/docker/ansible'
import Config from '../../../src/adapters/config'
import { inject } from '../../../src/hooks/init/init'

const sandbox = sinon.createSandbox()

describe('Ansible adapter', () => {

    beforeEach(() => {
        inject()
        sandbox.stub(console, 'log')
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('calls _playbook.command', async function () {
        // arrange
        sandbox.stub(Config.prototype, 'get').withArgs(sinon.match.any).returns('ENV_VARIABLE')
        const command = sandbox.stub(AnsiblePlaybook.prototype, 'command').resolves()

        // act
        await new Ansible().createSpaContainer('v0.0.24')

        //assert
        sandbox.assert.calledOnce(command)
    })

})