import 'reflect-metadata'
import sinon from 'sinon'
import {expect} from 'chai'
import {test} from '@oclif/test'

import Deploy from '../../src/services/deploy'
import * as color from '../../src/core/color'

const sandbox = sinon.createSandbox()

describe('deploy:clean command', () => {
  beforeEach(() => {
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
  .stub(Deploy.prototype, 'destroyDeployments', sandbox.stub().rejects([true, 'Failure']))
  .stub(color, 'error', sandbox.stub())
  .command(['deploy:clean', 'staging'])
  .it('outputs an error when a rejection occurs within destroyDeployments', () => {
    expect((color.error as any).called).to.equal(true)
  })

  test
  .stub(Deploy.prototype, 'clean', sandbox.stub().resolves([true, '']))
  .stub(Deploy.prototype, 'destroyDeployments', sandbox.stub().throwsException())
  .stub(color, 'error', sandbox.stub())
  .command(['deploy:clean', 'staging'])
  .it('outputs an error when a thrown Error occurs within destroyDeployments', () => {
    expect((color.error as any).called).to.equal(true)
  })
})
