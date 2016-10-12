import sortKeys from 'sort-keys';
import querystring from 'querystring';
import crypto from 'crypto';

const apiEndpoints = {
  getToken: 'https://api.nexmo.com/sdk/token/json?',
  verify: 'https://api.nexmo.com/sdk/verify/json?',
  verifyCheck: 'https://api.nexmo.com/sdk/verify/check/json?',
  verifyControl: 'https://api.nexmo.com/sdk/verify/control/json?',
  verifySearch: 'https://api.nexmo.com/sdk/verify/search/json?',
  verifyLogout: 'https://api.nexmo.com/sdk/verify/logout/json?',
};

function nexmoHeaders() {
  return (req, next) => {
    req.set('Content-type', 'application/x-www-form-urlencoded');
    req.set('Content-Encoding', 'UTF-8');
    req.set('X-NEXMO-SDK-OS-FAMILY', 'JS');
    req.set('X-NEXMO-SDK-REVISION', '0.2');
    return next();
  };
}


function isClientSet(client) {
  if (client.appId === undefined || client.sharedSecret === undefined) {
    return false;
  }
  return true;
}

function isResponseValid(response, sharedSecret) {
  console.log(response);
  if (response.headers && !response.headers['x-nexmo-response-signature']) {
    return false;
  }
  let r = JSON.stringify(JSON.parse(response.body), null, 4);
  const s = response.headers['x-nexmo-response-signature'];
  r += sharedSecret;
  const responseMd5 = crypto.createHash('md5').update(r).digest('hex');
  if (responseMd5 === s) {
    return true;
  }
  return false;
}

function createSignature(signatureParams, sharedSecret) {
  let s = signatureParams;
  s = decodeURIComponent(s);
  s = `&${s}${sharedSecret}`;
  return crypto.createHash('md5').update(s).digest('hex');
}

function generateParameters(params, client) {
  const now = Math.round(new Date().getTime() / 1000);

  let tokenForRequest;
  let tokenForSignature;

  // Generate parameters for verify* requests (you have the token)
  if ({}.hasOwnProperty.call(client, 'token')) {
    tokenForRequest = JSON.parse(JSON.stringify(client.token));
    tokenForSignature = JSON.parse(JSON.stringify(client.token));
    tokenForSignature = tokenForSignature.replace(/[&,=]/g, '_');
  }

  let signatureParams = params;
  if ({}.hasOwnProperty.call(client, 'token')) {
    signatureParams.token = tokenForSignature;
  }
  signatureParams.timestamp = now;
  signatureParams = sortKeys(signatureParams);
  signatureParams = querystring.stringify(signatureParams);
  const signature = createSignature(signatureParams, client.sharedSecret);

  let requestParameters = params;
  requestParameters.timestamp = now;
  if ({}.hasOwnProperty.call(client, 'token')) {
    requestParameters.token = tokenForRequest;
  }
  requestParameters = sortKeys(requestParameters);
  requestParameters = querystring.stringify(requestParameters);
  requestParameters = `${requestParameters}&sig=${signature}`;

  return requestParameters;
}

module.exports = {
  apiEndpoints,
  createSignature,
  isClientSet,
  isResponseValid,
  nexmoHeaders,
  generateParameters,
};
