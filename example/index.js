var NexmoVerify = require('../lib');

require('dotenv').config({path: __dirname + '/.env'});

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var N = new NexmoVerify({
  appId: process.env.APP_ID,
  sharedSecret: process.env.SHARED_SECRET
});

var phoneNumber = null;

function getPhoneNumber() {
  rl.question('What is your phone number? ', getCountryCode);  
}

function getCountryCode(num) {
  phoneNumber = num;
  
  rl.question('What is your countryCode? ', verify);
}

function verify(countryCode) {
  N.verify({
    number: phoneNumber,
    country: countryCode,
    lg: 'en-US' //optional
  }).then(function(status) {
    // Handle the request to Verify SDK that is progressing normally.
    // Example status values are: verified, pending, failed.
    console.log('Verify status', status);
    
    getVerifyCode();
  }, function( error ) {
    // Handle an issue in your call to Verify SDK. Normally this occurs when one of
    // the parameters in the NexmoVerify object or this call is incorrect.
    console.error('Verify error', error);
  });
};

function getVerifyCode() {
  rl.question('What is your pin code?', verifyCode);
}

function verifyCode(code) {
  N.verifyCheck({
    number: phoneNumber,
    code: code
  }).then(function(status) {
    // Handle the request to Verify SDK that is progressing normally.
    console.log('Verify check status', status);
  },function( error ){
    // Handle an issue in your call to Verify SDK. Normally this occurs when one of
    // the parameters in the NexmoVerify object or this call is incorrect.
    console.error('Verify check error', error);
  });
}

var exiting = false;
process.on('beforeExit', function() {
  console.log('Process exiting...');
  
  // Ignore if:
  // 1. user hasn't entered phone number we can ignore
  // 2. already existing
  if(!phoneNumber || exiting === true) {
    return;
  }
  exiting = true;
  
  N.verifyLogout({
    number: phoneNumber,
  }).then(function(status) {
    // Handle the user_status
    console.log('Verify logout status', status);
  },function( error ){
    // Handle an issue in your call to Verify SDK. Normally this occurs when one of
    // the parameters in the NexmoVerify object or this call is incorrect.
    console.log('Verify logout error', error);
  });
})

getPhoneNumber();
