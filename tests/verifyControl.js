import config from './config.example.json';
import Nexmo from '../src/index.js';
import chai from 'chai';
const assert = chai.assert;
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('Verify Control', () => {
  it('returns an error if the credentials are not set', () => {
    const n = new Nexmo();
    return assert.isRejected(n.verifyControl(), 'You need to set credentials');
  });

  it('returns an error if the number is not passed as parameter', () => {
    const n = new Nexmo(config);
    return assert.isRejected(n.verifyControl(), 'Cannot read property \'number\' of undefined');
  });

  it('returns an error if the pin is not passed as parameter', () => {
    const n = new Nexmo(config);
    return assert.isRejected(n.verifyControl({
      number: 123456789,
    }), 'You need to pass a command');
  });
});
