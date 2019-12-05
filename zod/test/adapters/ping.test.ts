import 'reflect-metadata'
import https from 'https';
import sinon from 'sinon'
import Ping, { PING_MESSAGES } from '../../src/adapters/ping';
const sandbox = sinon.createSandbox()

describe('Ping adapter', () => {

    beforeEach(() => {
        sandbox.useFakeServer()
        sandbox.stub(console, 'log')
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('retries the given amount of attempts and shows the correct message', async function () {
        // arrange
        const siteToPing = '/some/random/site';
        const exampleServer = sinon.fakeServer.create();
        exampleServer.respondWith('get', siteToPing, [500, {}, 'Failed'])
        const failedToPingSiteMessage = sandbox.stub(PING_MESSAGES, 'FAILED_TO_PING_SITE_RETRYING')
        const attempts = 3

        // act
        await new Ping().check(siteToPing, attempts, 0).catch(err => err)

        // assert
        sandbox.assert.calledTwice(failedToPingSiteMessage)

        exampleServer.restore()
    })

})