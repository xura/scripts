import 'reflect-metadata';
import * as response from '../../src/core/color';
import { test } from '@oclif/test'
import sinon from 'sinon';
import Deploy from '../../src/services/deploy';

describe('Deploy command', () => {
  const deploy =
    sinon.stub(Deploy.prototype, "clean").resolves([true, 'Successfully cleaned']);
  const success = sinon.stub(response, 'success').returns('Success');

  test
    .command(['deploy:clean', 'staging'])
    .it('runs deploy:clean', ctx => {
      sinon.assert.called(deploy);
      sinon.assert.called(success);
    });
})
