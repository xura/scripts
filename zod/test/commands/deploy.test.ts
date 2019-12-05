import 'reflect-metadata'
import sinon from 'sinon'
import chai from 'chai'
import cap from 'chai-as-promised'
import { test } from '@oclif/test'

import Deploy from '../../src/services/deploy'
import * as response from '../../src/core/color'
import { Environment } from '../../src/interfaces/config'

const sandbox = sinon.createSandbox()

describe('Deploy command', () => {
  let deploy: sinon.SinonStub<[string, Environment], Promise<[boolean, string[]]>>
  let success: sinon.SinonStub<[string], string>

  beforeEach(() => {
    chai.should()
    chai.use(cap)
    sandbox.stub(Deploy.prototype, 'destroyDeployments').resolves([true, 'Destroyed successfully'])
    deploy = sandbox.stub(Deploy.prototype, 'clean').resolves([true, []])
    success = sandbox.stub(response, 'success').returns('Success')
    sandbox.stub(console, 'log')
  })

  afterEach(() => {
    sandbox.restore()
  })

  test
    .command(['deploy:clean', 'staging'])
    .it('runs deploy:clean', () => {
      sandbox.assert.called(deploy)
      sandbox.assert.called(success)
    })
})
