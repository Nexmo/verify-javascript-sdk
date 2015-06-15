var request = require('request');
var qs = require('qs');
var crypto = require('crypto');

var apiEndpoint = 'https://rest.nexmo.com/sdk/token/json';

var nexmoRequest = request.defaults({
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    'Content-Encoding': 'UTF-8',
    'X-NEXMO-SDK-OS-FAMILY ': 'ANDROID',
    'X-NEXMO-SDK-OS-REVISION': '5',
    'X-NEXMO-SDK-REVISION': '0.1'
  }
});

function getToken(appId, deviceId, sourceIp, sharedSecret, callback) {

  var now = Math.round(new Date().getTime() / 1000);

  var signatureParameters = {
    'app_id': appId,
    'device_id': deviceId,
    'source_ip_address': sourceIp,
    'timestamp': now,
  };

  signatureParameters = qs.stringify(signatureParameters);
  signatureParameters = '&' + signatureParameters + sharedSecret;

  var signature = crypto.createHash('md5').update(signatureParameters).digest('hex');

  var tokenParameters = qs.stringify({
    'app_id': appId,
    'device_id': deviceId,
    'source_ip_address': sourceIp,
    'timestamp': now,
    'sig': signature
  });

  nexmoRequest.get(apiEndpoint + '?' + tokenParameters, callback);
}

function checkToken() {
  // TODO check if token is still valid?
}

function verify() {
  // TODO start verification flow
}

function verifyCheck() {
  // TODO check whether the PIN code you got from your end user matches the one Nexmo sent.
}

function checkUserStatus() {
  // TODO check the current status for an SDK user (pending, verified, expired...)
}

function controlFlow() {
  // TODO control the verification workflow
}

function userLogout() {
  // TODO when a user has status VERIFIED it can be logout. User's new status would be UNVERIFIED
}

module.exports = {
  getToken: getToken,
  checkToken: checkToken,
  verify: verify,
  verifyCheck: verifyCheck,
  checkUserStatus: checkUserStatus,
  controlFlow: controlFlow,
  userLogout: userLogout
};
