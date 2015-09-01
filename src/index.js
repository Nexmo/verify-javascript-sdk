import verify from './verify.js';
import verifyCheck from './verifyCheck.js';
import verifyControl from './verifyControl.js';
import verifySearch from './verifySearch.js';
import verifyLogout from './verifyLogout.js';
import macaddress from 'macaddress';

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
  this.verifyCheck = this.verifyCheck.bind(this);
  this.verifyControl = this.verifyControl.bind(this);
  this.verifySearch = this.verifySearch.bind(this);
  this.verifyLogout = this.verifyLogout.bind(this);
}

NexmoVerify.prototype.verify = verify;
NexmoVerify.prototype.verifyCheck = verifyCheck;
NexmoVerify.prototype.verifyControl = verifyControl;
NexmoVerify.prototype.verifySearch = verifySearch;
NexmoVerify.prototype.verifyLogout = verifyLogout;

module.exports = NexmoVerify;
