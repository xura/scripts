import chai, {expect} from 'chai'
import sinon from 'sinon'
import cap from 'chai-as-promised'

import Deploy, {DEPLOY_ERRORS} from '../../src/services/deploy'
import Ping from '../../src/adapters/ping'
import Spaces from '../../src/adapters/cdn/spaces'
import Ansible from '../../src/adapters/docker/ansible'
import {inject} from '../../src/hooks/init/init'

const sandbox = sinon.createSandbox()

describe('Deploy service', () => {
  beforeEach(() => {
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
    await expect(new Deploy(undefined).clean('3', 'staging')).to.eventually.be.rejected.then(error => {
      expect(error[1]).to.equal(expectedError)
    })
  })

  it('calls clean', async function () {
    // arrange
    sandbox.stub(Ansible.prototype, 'destroySpaContainers').resolves([true, 'Successfully destroyed'])
    inject()
    const cleanedDeployments = ['v0.0.25']
    const clean = sandbox.stub(Spaces.prototype, 'clean').resolves([true, cleanedDeployments])
    const deployService = new Deploy()

    // assert
    await expect(deployService.clean('3', 'staging')).to.eventually.be.fulfilled.then(message => {
      expect(message[1]).to.equal(cleanedDeployments)
    })
    sandbox.assert.called(clean)
  })

  it('calls destroyDeployments', async function () {
    // arrange
    inject()
    const destroyedDeployments = ['v0.0.25']
    const expectedMessage = 'Deployments destroyed'
    const destroyDeployments = sandbox.stub(Ansible.prototype, 'destroySpaContainers').resolves([true, expectedMessage])
    const deployService = new Deploy()

    // assert
    await expect(deployService.destroyDeployments(destroyedDeployments)).to.eventually.be.fulfilled.then(message => {
      expect(message[1]).to.equal(expectedMessage)
    })
    sandbox.assert.called(destroyDeployments)
  })

  it('rejects with an error when docker is not injected properly', async function () {
    // arrange
    inject()
    const expectedError = DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('docker')

    // assert
    await expect(new Deploy(undefined, undefined).destroyDeployments([''])).to.eventually.be.rejected.then(error => {
      expect(error[1]).to.equal(expectedError)
    })
  })

  it('calls ping', async function () {
    // arrange
    inject()
    const siteToPing = 'example.com'
    const expectedMessage = 'Site ping'
    const ping = sandbox.stub(Ping.prototype, 'check').resolves([true, expectedMessage])
    const deployService = new Deploy()

    // assert
    await expect(deployService.ping(siteToPing)).to.eventually.be.fulfilled.then(message => {
      expect(message[1]).to.equal(expectedMessage)
    })
    sandbox.assert.called(ping)
  })

  it('rejects with an error when ping is not injected properly', async function () {
    // arrange
    const expectedError = DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('ping')

    // assert
    await expect(new Deploy(undefined, undefined, undefined).ping('')).to.eventually.be.rejected.then(error => {
      expect(error[1]).to.equal(expectedError)
    })
  })

  it('calls create', async function () {
    // arrange
    inject()
    const tag = 'v0.0.24'
    const expectedMessage = 'Spa create'
    const create = sandbox.stub(Ansible.prototype, 'createSpaContainer').resolves([true, expectedMessage])
    const deployService = new Deploy()

    // assert
    await expect(deployService.create(tag)).to.eventually.be.fulfilled.then(message => {
      expect(message[1]).to.equal(expectedMessage)
    })
    sandbox.assert.called(create)
  })

  it('rejects with an error when docker is not injected properly for create', async function () {
    // arrange
    const expectedError = DEPLOY_ERRORS.PROPERTY_NOT_INJECTED('docker')

    // assert
    await expect(new Deploy(undefined, undefined, undefined).create('')).to.eventually.be.rejected.then(error => {
      expect(error[1]).to.equal(expectedError)
    })
  })
})
