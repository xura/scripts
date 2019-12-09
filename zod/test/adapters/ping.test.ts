import 'reflect-metadata'
import sinon from 'sinon'
import Ping, {PING_MESSAGES} from '../../src/adapters/ping'
import nock from 'nock'
import {expect} from 'chai'

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
    const siteToPing = 'example.com'
    nock(`https://${siteToPing}`)
    .get('/')
    .replyWithError({
      message: 'something awful happened',
      code: 'AWFUL_ERROR',
    })

    const failedToPingSiteRetrying = sandbox.stub(PING_MESSAGES, 'FAILED_TO_PING_SITE_RETRYING')
    // const failedToPingReachSite = sandbox.stub(PING_ERRORS, 'FAILED_TO_REACH_SITE')

    // const failedToReachSiteAfterRetries = sandbox.stub(PING_ERRORS, 'FAILED_TO_REACH_SITE_AFTER_RETRIES')
    const attempts = 3

    // act
    await new Ping().check(siteToPing, attempts, 0).catch(error => error)

    // assert
    // sandbox.assert.calledThrice(failedToPingReachSite)
    sandbox.assert.calledTwice(failedToPingSiteRetrying)
    // sandbox.assert.calledOnce(failedToReachSiteAfterRetries)
  })

  it('succeeds in reaching the site and resolves correctly', async function () {
    // arrange
    const siteToPing = 'example.com'
    nock(`https://${siteToPing}`)
    .get('/')
    .reply()

    const successfullyPingedSite = sandbox.stub(PING_MESSAGES, 'SUCCESSFULLY_PINGED_SITE')

    // act
    await new Ping().check(siteToPing, 3, 0).catch(error => error)

    // assert
    sandbox.assert.calledOnce(successfullyPingedSite)
  })

  it('calls SUCCESSFULLY_PINGED_SITE properly', function () {
    // arrange
    const site = 'example.com'

    // act
    const message = PING_MESSAGES.SUCCESSFULLY_PINGED_SITE(site)

    // assert
    expect(message).to.eq(`Successfully reached ${site}`)
  })

  it('calls FAILED_TO_PING_SITE_RETRYING properly', function () {
    // arrange
    const site = 'example.com'
    const retryCount = 3

    // act
    const message = PING_MESSAGES.FAILED_TO_PING_SITE_RETRYING(site, retryCount)

    // assert
    expect(message).to.eq(`Failed to ping ${site}. Retry #${retryCount}...`)
  })
})
