import nexmoRequest from './nexmoRequest';
import shared from './shared';
import { checkToken } from './token';

const apiEndpoint = shared.apiEndpoints.verifySearch;
const generateParameters = shared.generateParameters;

let retry = 0;

function verifySearch(params) {
  const client = this;

  if (!shared.isClientSet(client)) {
    return Promise.reject('You need to set credentials');
  }

  if (!params) {
    return Promise.reject('You need to pass a number');
  } else if (!params.number) {
    return Promise.reject('You need to pass a number');
  }

  return checkToken(client).then((token) => {
    client.token = token;

    const queryParams = {
      app_id: client.appId,
      device_id: client.deviceId,
      number: params.number,
      source_ip_address: client.sourceIp,
    };

    if (params.country) {
      queryParams.country = params.country;
    }

    return nexmoRequest(apiEndpoint + generateParameters(queryParams, client)).then((res) => {
      // Check if the token is invalid request a new one and call again the function
      if (res.data.result_code === 3) {
        if (retry < 1) {
          retry = 1;
          client.token = 'invalid';
          return verifySearch.call(client, params);
        }
      } else {
        retry = 0;
      }

      // Any result_code different than zero means an error, return the error.
      if (res.data.result_code !== 0) {
        return Promise.reject(res.data.result_message);
      }

      if (!shared.isResponseValid(res, client.sharedSecret)) {
        return Promise.reject('Response verification failed');
      }
      return Promise.resolve(res.data.user_status);
    }).catch(err => Promise.reject(err));
  }).catch(err => Promise.reject(err));
}

module.exports = verifySearch;
