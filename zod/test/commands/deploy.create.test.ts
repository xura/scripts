import 'reflect-metadata'
import sinon from 'sinon'
import chai from 'chai'
import cap from 'chai-as-promised'
import {test, expect} from '@oclif/test'

import Deploy from '../../src/services/deploy'
import * as color from '../../src/core/color'

const sandbox = sinon.createSandbox()

describe('deploy:create command', () => {
  beforeEach(() => {
    chai.should()
    chai.use(cap)
    sandbox.stub(color, 'blue')
    sandbox.stub(console, 'log')
  })

  afterEach(() => {
    sandbox.restore()
  })

  test
  .stub(Deploy.prototype, 'create', sandbox.stub().withArgs(sinon.match.any, sinon.match.any).resolves([true, '']))
  .stub(Deploy.prototype, 'ping', sandbox.stub().resolves([true, '']))
  .command(['deploy:create', 'v0.0.24'])
  .it('runs deploy:create', () => {
    expect((Deploy.prototype.create as any).called).to.equal(true)
    expect((Deploy.prototype.ping as any).called).to.equal(true)
  })

  test
  .stub(Deploy.prototype, 'create', sandbox.stub().rejects([true, 'Failure']))
  .stub(color, 'error', sandbox.stub())
  .command(['deploy:create', 'v0.0.24'])
  .it('outputs an error when a rejection occurs', () => {
    expect((color.error as any).called).to.equal(true)
  })

  test
  .stub(Deploy.prototype, 'create', sandbox.stub().rejects(new Error()))
  .stub(color, 'error', sandbox.stub())
  .command(['deploy:create', 'v0.0.24'])
  .it('outputs an error when a rejection occurs', () => {
    expect((color.error as any).called).to.equal(true)
  })
})
