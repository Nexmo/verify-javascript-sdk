import popsicle from 'popsicle';
import shared from './shared.js';

const generateParameters = shared.generateParameters;
const nexmoHeaders = shared.nexmoHeaders;
const apiEndpoint = shared.apiEndpoints.getToken;

function getToken(client) {
  return new Promise((resolve, reject) => {
    const queryParams = {
      'app_id': client.appId,
      'device_id': client.deviceId,
      'source_ip_address': client.sourceIp,
    };

    popsicle(apiEndpoint + generateParameters(queryParams, client))
      .use(nexmoHeaders())
      .then((res) => {
        // Any result_code different than zero means an error, return the error.
        if (res.body.result_code !== 0) {
          return reject(res.body.result_message);
        }

        if (!shared.isResponseValid(res, client.sharedSecret)) {
          return reject('Response verification failed');
        } else {
          return resolve(res.body.token);
        }
      }, (err) => {
        return reject(err);
      });
  });
}

function checkToken(client) {
  return new Promise((resolve, reject) => {
    if (!client.token || client.token === 'invalid') {
      getToken(client).then((token) => {
        return resolve(token);
      }, (error) => {
        return reject(error);
      });
    } else {
      return resolve(client.token);
    }
  });
}

module.exports = {
  checkToken: checkToken,
  getToken: getToken,
};
