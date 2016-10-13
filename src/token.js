import nexmoRequest from './nexmoRequest';
import shared from './shared';

const generateParameters = shared.generateParameters;
const apiEndpoint = shared.apiEndpoints.getToken;

function getToken(client) {
  const queryParams = {
    app_id: client.appId,
    device_id: client.deviceId,
    source_ip_address: client.sourceIp,
  };

  return nexmoRequest(apiEndpoint + generateParameters(queryParams, client))
    .then((res) => {
      // Any result_code different than zero means an error, return the error.
      if (res.data.result_code !== 0) {
        return Promise.reject(res.data.result_message);
      }

      if (!shared.isResponseValid(res, client.sharedSecret)) {
        return Promise.reject('Response verification failed');
      }
      return Promise.resolve(res.data.token);
    })
    .catch(err => Promise.reject(err));
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
