import 'reflect-metadata'
import sinon from 'sinon'
import chai, { expect } from 'chai'
import cap from 'chai-as-promised'
import { test } from '@oclif/test'

import Deploy from '../../src/services/deploy'
import * as color from '../../src/core/color'
import { Environment } from '../../src/interfaces/config'

const sandbox = sinon.createSandbox()

describe('deploy:clean command', () => {
  let deploy: sinon.SinonStub<[string, Environment], Promise<[boolean, string[]]>>
  let success: sinon.SinonStub<[string], string>

  beforeEach(() => {
    // chai.should()
    // chai.use(cap)
    // sandbox.stub(Deploy.prototype, 'destroyDeployments').resolves([true, 'Destroyed successfully'])
    // deploy = sandbox.stub(Deploy.prototype, 'clean').resolves([true, []])
    // success = sandbox.stub(response, 'success')
    sandbox.stub(console, 'log')
  })

  afterEach(() => {
    sandbox.restore()
  })

  test
    .stub(Deploy.prototype, 'clean', sandbox.stub().resolves([true, '']))
    .stub(Deploy.prototype, 'destroyDeployments', sandbox.stub().resolves([true, '']))
    .stub(color, 'success', sandbox.stub())
    .command(['deploy:clean', 'staging'])
    .it('runs deploy:clean', () => {
      expect((Deploy.prototype.clean as any).called).to.equal(true)
      expect((Deploy.prototype.destroyDeployments as any).called).to.equal(true)
      expect((color.success as any).called).to.equal(true)
    })

  test
    .stub(Deploy.prototype, 'clean', sandbox.stub().rejects([true, '']))
    .stub(color, 'error', sandbox.stub())
    .command(['deploy:clean', 'staging'])
    .it('outputs an error when a rejection occurs', () => {
      expect((color.error as any).called).to.equal(true)
    })

  test
    .stub(Deploy.prototype, 'clean', sandbox.stub().resolves([true, '']))
    .stub(Deploy.prototype, 'destroyDeployments', sandbox.stub().rejects([true, '']))
    .stub(color, 'error', sandbox.stub())
    .command(['deploy:clean', 'staging'])
    .it('outputs an error when a rejection occurs within destroyDeployments', ctx => {
      expect((color.error as any).called).to.equal(true)
    })

  test
    .stub(Deploy.prototype, 'clean', sandbox.stub().resolves([true, '']))
    .stub(Deploy.prototype, 'destroyDeployments', sandbox.stub().rejects(new Error()))
    .stub(color, 'error', sandbox.stub())
    .command(['deploy:clean', 'staging'])
    .it('outputs an error when a rejection occurs within destroyDeployments', ctx => {
      expect((color.error as any).called).to.equal(true)
    })
})
