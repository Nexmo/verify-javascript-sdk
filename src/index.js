import macaddress from 'macaddress';

import verify from './verify';
import verifyCheck from './verifyCheck';
import verifyControl from './verifyControl';
import verifySearch from './verifySearch';
import verifyLogout from './verifyLogout';

const ip = require('ip').address();

const deviceId = macaddress.one((err, mac) => {
  if (err) {
    throw err;
  }
  return mac;
});

function NexmoVerify(config = {}) {
  this.appId = config.appId;
  this.sharedSecret = config.sharedSecret;
  this.deviceId = deviceId;
  this.sourceIp = ip;

  this.verify = verify.bind(this);
  this.verifyCheck = verifyCheck.bind(this);
  this.verifyControl = verifyControl.bind(this);
  this.verifySearch = verifySearch.bind(this);
  this.verifyLogout = verifyLogout.bind(this);
}

module.exports = NexmoVerify;
