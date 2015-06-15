// TODO Let's write some tests here
var config = require('./config.json');
var nexmo = require('./index.js');

// DEBUG work in progress
nexmo.getToken(config.appId, config.deviceId, config.sourceIp, config.sharedSecret, function(error, response, body) {
  console.log(response.statusCode);
});
