import popsicle from 'popsicle';
import shared from './shared';
import { checkToken } from './token';

const nexmoHeaders = shared.nexmoHeaders;
const apiEndpoint = shared.apiEndpoints.verifyLogout;
const generateParameters = shared.generateParameters;

let retry = 0;

function verifyLogout(params) {
  const client = this;

  return new Promise((resolve, reject) => {
    if (!shared.isClientSet(client)) {
      return reject('You need to set credentials');
    }

    if (!params.number) {
      return reject('You need to pass a number');
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

      popsicle(apiEndpoint + generateParameters(queryParams, client))
        .use(nexmoHeaders())
        .then((res) => {
          const body = JSON.parse(res.body);
          // Check if the token is invalid request a new one and call again the function
          if (body.result_code === 3) {
            if (retry < 1) {
              retry = 1;
              client.token = 'invalid';
              return verifyLogout.call(client, params);
            }
          } else {
            retry = 0;
          }

          // Any result_code different than zero means an error, return the error.
          if (body.result_code !== 0) {
            return reject(body.result_message);
          }

          if (!shared.isResponseValid(res, client.sharedSecret)) {
            return reject('Response verification failed');
          }
          return resolve(body.user_status);
        })
        .catch(err => reject(err));
    })
    .catch(err => reject(err));
  });
}

module.exports = verifyLogout;
