import config from './config.example.json';
import Nexmo from '../src/index.js';
import chai from 'chai';
import nock from 'nock';
import shared from '../src/shared.js';
import popsicle from 'popsicle';
const assert = chai.assert;

describe('Popsicle nexmoHeaders plugin', () => {
  it('should add Nexmo headers to every request', () => {
    nock('https://api.nexmo.com')
      .get('/sdk/token/json')
      .query(true)
      .reply(200);

    popsicle('https://api.nexmo.com/sdk/token/json')
      .use(shared.nexmoHeaders())
      .then((res) => {
        assert.equal(res.request.headers['content-type'], 'application/x-www-form-urlencoded');
        assert.equal(res.request.headers['content-encoding'], 'UTF-8');
        assert.equal(res.request.headers['x-nexmo-sdk-os-family'], 'JS');
        assert.equal(res.request.headers['x-nexmo-sdk-revision'], '0.1');
      });
  });
});

describe('Check if client is set (appId and sharedSecret)', () => {
  it('should return true if set', () => {
    const n = new Nexmo(config);
    assert.equal(shared.isClientSet(n), true);
  });
  it('should return false if one or both are missing', () => {
    const n = new Nexmo();
    assert.equal(shared.isClientSet(n), false);
  });
});

describe('Check the server response', () => {
  it('should return false if "x-nexmo-response-signature" is missing', () => {
    const response = {
      headers: {},
      body: {},
    };
    return assert.equal(shared.isResponseValid(response), false);
  });

  it('should return false if the signature is invalid', () => {
    const response = {
      headers: {
        'x-nexmo-response-signature': 'wrong_signature',
      },
      body: {
        result_code: 0,
        result_message: 'OK',
        timestamp: '1234567890',
        token: 'UBR51htkeMhUoQ0cIWEyffIeCcytVxqEGhwav0b8/nUAbjaQvPURuTtCYtIQ1YztbiNxSVRnXWLB\n2Meby4EVsYNumN4savfON3GpvSYg4BhmJPzZ2eWPiq0DnL/NwiPc75kM1KZE+otU98OC1X0T7w==\n',
      },
    };
    const sharedSecret = '1234567890abcdef';
    return assert.equal(shared.isResponseValid(response, sharedSecret), false);
  });

  it('should return true if the signature is valid', () => {
    const response = {
      headers: {
        'x-nexmo-response-signature': '41d30b9d645e32f386fa0719b819ee7a',
      },
      body: {
        result_code: 0,
        result_message: 'OK',
        timestamp: '1234567890',
        token: 'UBR51htkeMhUoQ0cIWEyffIeCcytVxqEGhwav0b8/nUAbjaQvPURuTtCYtIQ1YztbiNxSVRnXWLB\n2Meby4EVsYNumN4savfON3GpvSYg4BhmJPzZ2eWPiq0DnL/NwiPc75kM1KZE+otU98OC1X0T7w==\n',
      },
    };
    const sharedSecret = '1234567890abcdef';
    return assert.equal(shared.isResponseValid(response, sharedSecret), true);
  });
});

describe('Create signature', () => {
  it('should return a valid signature', () => {
    const sigParams = 'app_id=123456&device_id=80%3Ae6%3A50%3A04%3A23%3A52&source_ip_address=192.168.1.140&timestamp=1438811485';
    const sharedSecret = '123456';
    return assert.equal(shared.createSignature(sigParams, sharedSecret), '92bbbf636173e58fbb9a34af24fa080c');
  });
});
