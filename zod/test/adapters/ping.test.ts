import 'reflect-metadata'
import https from 'https';
import sinon from 'sinon'
import Ping, { PING_MESSAGES } from '../../src/adapters/ping';
import nock from 'nock';

const sandbox = sinon.createSandbox()

describe('Ping adapter', () => {

    beforeEach(() => {
        sandbox.stub(console, 'log')
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('retries the given amount of attempts and shows the correct message', async function () {
        // arrange
        const siteToPing = 'example.com';
        nock(`https://${siteToPing}`)
            .get('/')
            .replyWithError({
                message: 'something awful happened',
                code: 'AWFUL_ERROR',
            })

        const failedToPingSiteMessage = sandbox.stub(PING_MESSAGES, 'FAILED_TO_PING_SITE_RETRYING')
        const attempts = 3

        // act
        await new Ping().check(siteToPing, attempts, 0).catch(err => err)

        // assert
        sandbox.assert.calledTwice(failedToPingSiteMessage)
    })

})