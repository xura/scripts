import 'reflect-metadata'
import sinon from 'sinon'
import chai from 'chai'
import cap from 'chai-as-promised'
import { test } from '@oclif/test'

import Deploy from '../../src/services/deploy'
import * as response from '../../src/core/color'
import { Environment } from '../../src/interfaces/config'

const sandbox = sinon.createSandbox()

describe('deploy:create command', () => {
    let create: any
    let ping: any

    beforeEach(() => {
        chai.should()
        chai.use(cap)
        create = sandbox.stub(Deploy.prototype, 'create').resolves([true, ''])
        ping = sandbox.stub(Deploy.prototype, 'ping').resolves([true, ''])
        sandbox.stub(response, 'blue')
        sandbox.stub(console, 'log')
    })

    afterEach(() => {
        sandbox.restore()
    })

    test
        .command(['deploy:create', 'v0.0.24'])
        .it('runs deploy:create', () => {
            sandbox.assert.called(create)
            sandbox.assert.called(ping)
        })
})
