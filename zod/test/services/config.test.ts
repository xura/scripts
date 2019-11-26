import chai, {expect} from 'chai'
import sinon from 'sinon'
import cap from 'chai-as-promised'

import Config from '../../src/services/config'

const sandbox = sinon.createSandbox()

describe('Config service', () => {
  beforeEach(() => {
    chai.should()
    chai.use(cap)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('returns a string no matter what', async function () {
    // arrange
    const badConfigKeys = [undefined, null, '', false, true, new Date()]

    // assert
    expect(badConfigKeys.every(key => typeof (new Config().get(key as any)) === 'string'))
  })
})