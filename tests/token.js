import config from './config.example.json';
import Nexmo from '../src/index.js';
import chai from 'chai';
import nock from 'nock';
import Token from '../src/token.js';
const checkToken = Token.checkToken;
const assert = chai.assert;
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('Check if there is a token', () => {
  it('returns the token if it\'s already present', () => {
    const n = new Nexmo(config);
    n.token = '1234567890';
    assert.eventually.equal(checkToken(n), '1234567890');
  });

  it('returns a valid token if it\'s not present', () => {
    const n = new Nexmo({
      appId: '123456',
      sharedSecret: '123456',
    });
    nock('https://api.nexmo.com')
      .get('/sdk/token/json')
      .query(true)
      .reply(200, {
        result_code: 0,
        result_message: 'OK',
        timestamp: '1234567890',
        token: 'UBR51htkeMhUoQ0cIWEyffIeCcytVxqEGhwav0b8/nUAbjaQvPURuTtCYtIQ1YztbiNxSVRnXWLB\n2Meby4EVsYNumN4savfON3GpvSYg4BhmJPzZ2eWPiq0DnL/NwiPc75kM1KZE+otU98OC1X0T7w==\n',
      }, {
        'Content-type': 'application/json',
        'x-nexmo-response-signature': '78d054882b2a8d1562d90d7eb4cb0987',
      });
    assert.isFulfilled(checkToken(n));
    assert.eventually.equal(checkToken(n), 'UBR51htkeMhUoQ0cIWEyffIeCcytVxqEGhwav0b8/nUAbjaQvPURuTtCYtIQ1YztbiNxSVRnXWLB\n2Meby4EVsYNumN4savfON3GpvSYg4BhmJPzZ2eWPiq0DnL/NwiPc75kM1KZE+otU98OC1X0T7w==\n');
  });
});
