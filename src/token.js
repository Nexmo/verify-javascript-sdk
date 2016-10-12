import popsicle from 'popsicle';
import shared from './shared';

const generateParameters = shared.generateParameters;
const nexmoHeaders = shared.nexmoHeaders;
const apiEndpoint = shared.apiEndpoints.getToken;

function getToken(client) {
  return new Promise((resolve, reject) => {
    const queryParams = {
      app_id: client.appId,
      device_id: client.deviceId,
      source_ip_address: client.sourceIp,
    };

    popsicle(apiEndpoint + generateParameters(queryParams, client))
      .use(nexmoHeaders())
      .then((res) => {
        const body = JSON.parse(res.body);
        // Any result_code different than zero means an error, return the error.
        if (body.result_code !== 0) {
          return reject(body.result_message);
        }

        if (!shared.isResponseValid(res, client.sharedSecret)) {
          return reject('Response verification failed');
        }
        return resolve(body.token);
      })
      .catch(err => reject(err));
  });
}

function checkToken(client) {
  return new Promise((resolve, reject) => {
    if (!client || !client.token || client.token === 'invalid') {
      return getToken(client)
        .then(token => resolve(token))
        .catch(error => reject(error));
    }
    return resolve(client.token);
  });
}

module.exports = {
  checkToken,
  getToken,
};
