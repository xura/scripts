import 'reflect-metadata'
import sinon from 'sinon'
import AWSMock from 'aws-sdk-mock'
import cap from 'chai-as-promised'
import moment from 'moment'
import * as s3Commons from 's3-commons'
import chai, {expect} from 'chai'

import Spaces, {CDN_ERRORS, CDN_MESSAGES} from '../../../src/adapters/cdn/spaces'
import Config from '../../../src/services/config'
import {ConfigKey} from '../../../src/interfaces/config'

const sandbox = sinon.createSandbox()

describe('Spaces adapter', () => {
  let configStub: sinon.SinonStub<[ConfigKey], string>
  const possibleReleasePaths = [
    {Key: 'v0.0.24', LastModified: moment.utc('2019-01-01').toDate()},
    {Key: 'path/to/release/v0.0.28', LastModified: moment.utc('2019-01-06').toDate()},
    {Key: 'path/to/v0.0.26', LastModified: moment.utc('2019-01-04').toDate()},
    {Key: 'path/to/release/v0.0.27', LastModified: moment.utc('2019-01-05').toDate()},
    {Key: 'path/to/release/v0.0.29', LastModified: moment.utc('2019-01-07').toDate()},
    {Key: 'path/to////v0.0.25', LastModified: moment.utc('2019-01-03').toDate()},
    {Key: '', LastModified: null},
    {},
  ]
  const expectedDeploymentTags = [
    'staging/data/v0.0.24',
    'staging/data/v0.0.25',
    'staging/data/v0.0.26',
  ]
  const bucketName = 'xura-cdn'

  beforeEach(() => {
    chai.should()
    chai.use(cap)
    configStub = sandbox.stub(Config.prototype, 'get')
  })

  afterEach(() => {
    AWSMock.restore('S3')
    sandbox.restore()
  })

  it('calls _s3.listObjects with bucket and prefix', function () {
    // arrange
    const listObjects = sandbox.stub().resolves({Contents: []})
    AWSMock.mock('S3', 'listObjects', listObjects)
    configStub.withArgs(sinon.match.any).returns('ENV_VAR')

    const spacesAdapter = new Spaces(new Config())

    // act
    spacesAdapter.clean(3, 'staging').catch(error => error)

    // assert
    sandbox.assert.called(listObjects)
  })

  it('calls deleteRecursive the proper amount of times and with the proper arguments', async function () {
    // arrange
    configStub.withArgs('PROJECT').returns('data')
    configStub.withArgs('DIGITAL_OCEAN_BUCKET_NAME').returns(bucketName)

    const deleteRecursive = sandbox.stub(s3Commons, 'deleteRecursive').resolves(1)

    const listObjects = sandbox.stub().resolves({Contents: possibleReleasePaths})
    AWSMock.mock('S3', 'listObjects', listObjects)

    const spacesAdapter = new Spaces(new Config())

    // act
    const success = await spacesAdapter.clean(3, 'staging')

    // assert
    sandbox.assert.calledWith(deleteRecursive, sinon.match.any, bucketName, expectedDeploymentTags[0])
    sandbox.assert.calledWith(deleteRecursive, sinon.match.any, bucketName, expectedDeploymentTags[1])
    sandbox.assert.calledWith(deleteRecursive, sinon.match.any, bucketName, expectedDeploymentTags[2])
    expect(success[1]).to.eq(CDN_MESSAGES.SUCCESSFULLY_DELETED_THESE_DEPLOYMENTS(
      expectedDeploymentTags.join(', '),
    ))
  })

  it('rejects with an error message if deleteRecursive returns 0', async function () {
    // arrange
    configStub.withArgs('PROJECT').returns('data')
    configStub.withArgs('DIGITAL_OCEAN_BUCKET_NAME').returns(bucketName)

    sandbox.stub(s3Commons, 'deleteRecursive').resolves(0)

    const listObjects = sandbox.stub().resolves({Contents: possibleReleasePaths})
    AWSMock.mock('S3', 'listObjects', listObjects)

    const spacesAdapter = new Spaces(new Config())
    const expectedError = CDN_ERRORS.ERROR_DELETING_DEPLOYMENTS

    // assert
    await expect(spacesAdapter.clean(3, 'staging')).to.eventually.to.be.rejected.then(error => {
      expect(error[1]).to.equal(expectedError)
    })
  })

  it('rejects with an error message if total current deployments is <= keep argument', async function () {
    // arrange
    const listObjects = sandbox.stub().resolves({Contents: []})
    AWSMock.mock('S3', 'listObjects', listObjects)
    configStub.withArgs(sinon.match.any).returns('ENV_VAR')

    const spacesAdapter = new Spaces(new Config())
    const keep = 3
    const expectedError = CDN_ERRORS.DELETING_MORE_THAN_IS_AVAILABLE(3, 0)

    // assert
    await expect(spacesAdapter.clean(keep, 'staging')).to.eventually.be.rejected.then(error => {
      expect(error[1]).to.equal(expectedError)
    })
  })
})
