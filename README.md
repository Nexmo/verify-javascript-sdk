# Nexmo Verify JS SDK
Nexmo Verify enables you to verify whether one of your end users has access to a specific phone number by challenging them with a PIN code to enter into your application or website. That PIN code is sent by Nexmo via SMS and/or TTS (Text To Speech) call.  
[Documentation](https://docs.nexmo.com/index.php/verify)

### -- WORK IN PROGRESS --
Don't use this.
It's not published on npm also.

## Get started
Install the SDK `npm install --save nexmo-verify-sdk`
```
var NexmoVerifySDK = require('nexmo-verify-sdk');

```

## Flow example

## API
`.getToken(appId,deviceId,sourceIp,sharedSecret)`  
`.verify()`  
`.verifyCheck()`  
`.checkUserStatus()`  
`.controlFlow()`  
`.userLogo()`  

### Get token
|Parameter|Required|Info|
|---------|--------|----|
|Application ID|yes|Find it in your dashboard|
|Device ID|?|??|
|Source IP Address|yes|??|
|Shared Secret|yes|Find it in your dashboard|
Example
```
NexmoVerifySDK.getToken(appId,deviceId,sourceIp,sharedSecret,function(error, response, body){
  // do something
})
```
