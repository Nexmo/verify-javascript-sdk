import chai from 'chai';
import nock from 'nock';
import chaiAsPromised from 'chai-as-promised';

import config from './config.example.json';
import Nexmo from '../src';
import Token from '../src/token';

const checkToken = Token.checkToken;
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('Check if there is a token', () => {
  it('returns the token if it\'s already present', () => {
    const n = new Nexmo(config);
    n.token = '1234567890';
    return expect(checkToken(n)).to.eventually.equal('1234567890');
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
        'x-nexmo-response-signature': '8f80b7d048034c5bce757b8dddc02bce',
      });
    return expect(checkToken(n)).to.eventually.equal('UBR51htkeMhUoQ0cIWEyffIeCcytVxqEGhwav0b8/nUAbjaQvPURuTtCYtIQ1YztbiNxSVRnXWLB\n2Meby4EVsYNumN4savfON3GpvSYg4BhmJPzZ2eWPiq0DnL/NwiPc75kM1KZE+otU98OC1X0T7w==\n');
  });
});
