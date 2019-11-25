import 'reflect-metadata';
import sinon from 'sinon';
import Spaces from '../../../src/adapters/cdn/spaces';
import Config from '../../../src/services/config';
import AWSMock from 'aws-sdk-mock';
import chai from 'chai';
import cap from "chai-as-promised";

const sandbox = sinon.sandbox.create();

describe('Spaces adapter', () => {
    let listObjects: any;

    beforeEach(() => {
        chai.should();
        chai.use(cap);
        listObjects = sandbox.stub().resolves({ Contents: [] });
        AWSMock.mock('S3', 'listObjects', listObjects);
        sandbox.stub(Config.prototype, 'get').returns('ENV_VARIABLE');
    });

    afterEach(() => {
        AWSMock.restore('S3');
        sandbox.restore();
    })

    it('calls _s3.listObjects with bucket and prefix', function () {

        // arrange
        const spacesAdapter = new Spaces(new Config());

        // act
        spacesAdapter.clean(3, 'staging').catch(err => err);

        // assert
        sandbox.assert.called(listObjects);
    });

    it('rejects with error message if total current deployments is <= keep argument', function () {

        // assert
        Spaces.prototype.clean(3, 'staging').should.be.rejected;

    });

})
