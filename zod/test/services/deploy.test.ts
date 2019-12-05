import chai, { expect } from 'chai'
import sinon from 'sinon'
import cap from 'chai-as-promised'

import Deploy, { DEPLOY_ERRORS } from '../../src/services/deploy'
import Spaces from '../../src/adapters/cdn/spaces'
import Config from '../../src/adapters/config'
import Ansible from '../../src/adapters/docker/ansible'
import Ping from '../../src/adapters/ping'
import { inject } from '../../src/hooks/init/init'

const sandbox = sinon.createSandbox()

describe('Deploy service', () => {
  beforeEach(() => {
    inject()
    sandbox.stub(Ansible.prototype, 'destroySpaContainers').resolves([true, 'Successfully destroyed'])
    chai.should()
    chai.use(cap)
    sandbox.stub(console, 'log')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('rejects with an error when cdn is not injected properly', async function () {
    // arrange
    const expectedError = DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('cdn')

    // assert
    await expect(new Deploy().clean('3', 'staging')).to.eventually.be.rejected.then(error => {
      expect(error[1]).to.equal(expectedError)
    })
  })

  it('calls clean', async function () {
    // arrange
    const expectedMessage = 'Successfully cleaned'
    const clean = sandbox.stub(Spaces.prototype, 'clean').resolves([true, []])
    const deployService = new Deploy()

    // assert
    await expect(deployService.clean('3', 'staging')).to.eventually.be.fulfilled.then(message => {
      expect(message[1]).to.equal(expectedMessage)
    })
    sandbox.assert.called(clean)
  })
})
