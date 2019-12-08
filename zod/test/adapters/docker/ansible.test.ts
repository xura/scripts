import 'reflect-metadata'
import sinon from 'sinon'
import cap from 'chai-as-promised'

import { AnsiblePlaybook } from 'ansible-playbook-cli-js'
import Ansible, { ANSIBLE_MESSAGES } from '../../../src/adapters/docker/ansible'
import Config from '../../../src/adapters/config'
import { inject } from '../../../src/hooks/init/init'
import chai, { expect } from 'chai'

const sandbox = sinon.createSandbox()

describe('Ansible adapter', () => {

    beforeEach(() => {
        inject()
        chai.should()
        chai.use(cap)
        sandbox.stub(Config.prototype, 'get').withArgs(sinon.match.any).returns('ENV_VARIABLE')
        sandbox.stub(console, 'log')
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('calls _playbook.command when calling createSpaContainer', async function () {
        // arrange
        const command = sandbox.stub(AnsiblePlaybook.prototype, 'command').resolves()
        const stagingUrlCrrated = sandbox.stub(ANSIBLE_MESSAGES, 'STAGING_URL_CREATED')
        const attemptingToCreateStagingUrl = sandbox.stub(ANSIBLE_MESSAGES, 'ATTEMPTING_TO_CREATE_STAGING_URL')

        // act
        await new Ansible().createSpaContainer('v0.0.24')

        //assert
        sandbox.assert.calledOnce(command)
        sandbox.assert.calledOnce(stagingUrlCrrated)
        sandbox.assert.calledOnce(attemptingToCreateStagingUrl)
    })

    it('rejects with error when _platbook.command throws an Error when calling createSpaContainer', async function () {

        // arrange
        const expectedError = new Error('Error thrown')
        sandbox.stub(AnsiblePlaybook.prototype, 'command').throws(expectedError)
        const ansibleAdapter = new Ansible()

        // act
        await expect(ansibleAdapter.createSpaContainer('')).to.eventually.be.rejected.then(error => expect(error[1]).to.equal(expectedError))

    })

    it('calls _playbook.command when calling destroySpaContainers', async function () {
        // arrange
        const command = sandbox.stub(AnsiblePlaybook.prototype, 'command').resolves()
        const deploymentsDestroyed = sandbox.stub(ANSIBLE_MESSAGES, 'DEPLOYMENTS_DESTROYED')
        const attemptingToDestroyContainers = sandbox.stub(ANSIBLE_MESSAGES, 'ATTEMPTING_TO_DESTROY_DEPLOYMENTS')

        // act
        await new Ansible().destroySpaContainers(['v0.0.24'])

        //assert
        sandbox.assert.calledOnce(command)
        sandbox.assert.calledOnce(deploymentsDestroyed)
        sandbox.assert.calledOnce(attemptingToDestroyContainers)
    })

    it('rejects with error when _platbook.command throws an Error when calling destroySpaContainers', async function () {

        // arrange
        const expectedError = new Error('Error thrown')
        sandbox.stub(AnsiblePlaybook.prototype, 'command').throws(expectedError)
        const ansibleAdapter = new Ansible()

        // act
        await expect(ansibleAdapter.destroySpaContainers([''])).to.eventually.be.rejected.then(error => expect(error[1]).to.equal(expectedError))

    })

    it('calls STAGING_URL_CREATED properly', function () {
        // arrange
        const stagingUrl = 'example.com'
        const expectedMessage = `A staging container has been deployed at ${stagingUrl}`

        // act
        const message = ANSIBLE_MESSAGES.STAGING_URL_CREATED(stagingUrl)

        // assert
        expect(message).to.eq(expectedMessage)
    })

    it('calls DEPLOYMENTS_DESTROYED properly', function () {
        // arrange
        const stagingUrlsDescriptor = 'descriptor'
        const expectedMessage = `The following deployments no longer have staging URLs: ${stagingUrlsDescriptor}`

        // act
        const message = ANSIBLE_MESSAGES.DEPLOYMENTS_DESTROYED(stagingUrlsDescriptor)

        // assert
        expect(message).to.eq(expectedMessage)
    })

})