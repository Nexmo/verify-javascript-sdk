# Nexmo Verify JS SDK
Nexmo Verify enables you to verify whether one of your end users has access to a specific phone number by challenging them with a PIN code to enter into your application or website. That PIN code is sent by Nexmo via SMS and/or TTS (Text To Speech) call.  
[Documentation](https://docs.nexmo.com/index.php/verify)

## Install the SDK
**Node** `npm install --save nexmo-verify-sdk`  
```javascript
var Nexmo = require('nexmo-verify-sdk');
```

## API
### Initialize the client
```javascript
var N = new NexmoVerify({
  appId: 'xxxxx-xxxxx-xxxxx-xxxxx',
  sharedSecret: 'xxxxxxxx'
});
```

### Verify
`.verify(parameters)`  
parameters is a JSON object with

|Name|Type|Required|Info|
|----|--------|---|---|
|number|number|Required| Must be in international format (E164) example: 440201234567|
|country|string|Optional|GB|
|lg|string|Optional|language, en-US|

The callback will return an `error` or user status (`verified`, `pending`, `failed` ... )

Example
```javascript
N.verify({
  number: 440201234567,
  country: 'UK', // optional
  lg: 'en-US' //optional
}).then(function(status) {
  // return the user_status
}, function(error){
  // return the error
});
```

### Verify Check
`.verifyCheck(parameters)`  

|Name|Type|Required|Info|
|----|--------|---|---|
|number|number|Required| Must be in international format (E164) example: 440201234567|
|pin code|number|Required|4-6 digits|
|country|string|Optional|GB|

The callback will return an `error` or the user status (`verified`, `pending`, `failed` ... )

Example
```javascript
N.verifyCheck({
  number: 440201234567,
  code: 1234
}).then(function(status) {
  // return the user_status
}, function(error){
  // return the error
});
```

### Verify Search
`.verifySearch(parameters)`  

|Name|Type|Required|Info|
|----|--------|---|---|
|number|number|Required| Must be in international format (E164) example: 440201234567|
|country|string|Optional|GB|

The callback will return an `error` or the user status (`verified`, `pending`, `failed` ... )

Example
```javascript
N.verifySearch({
  number: 440201234567,
}).then(function(status) {
  // return the user_status
}, function(error){
  // return the error
});
```

### Verify Control
`.verifyControl(parameters)`  

|Name|Type|Required|Info|
|----|--------|---|---|
|number|number|Required| Must be in international format (E164) example: 440201234567|
|cmd|string|Required|Action: `cancel`, `trigger_next_event`|
|country|string|Optional|GB|

The callback will return an `error` or the user status (`verified`, `pending`, `failed` ... )

Example
```javascript
N.verifyControl({
  number: 440201234567,
  cmd: 'cancel'
}).then(function(status) {
  // return the user_status
}, function(error){
  // return the error
});
```


### Verify Logout
`.verifyLogout(parameters)`  

|Name|Type|Required|Info|
|----|--------|---|---|
|number|number|Required| Must be in international format (E164) example: 440201234567|
|country|string|Optional|GB|

The callback will return an `error` or the user status (`verified`, `pending`, `failed` ... )

Example
```javascript
N.verifyLogout({
  number: 440201234567,
}).then(function(status) {
  // return the user_status
}, function(error){
  // return the error
});
```

## Development
Use `npm run watch` to monitor for changes on `src/*.js` and recompile everything with Babel into `lib/`.


## Testing
`npm test`

## License

Copyright (c) 2015 Nexmo, Inc.
All rights reserved.
Licensed only under the Nexmo Verify SDK License Agreement (the "License") located at

https://www.nexmo.com/terms-use/verify-sdk/

By downloading or otherwise using our software or services, you acknowledge
that you have read, understand and agree to be bound by the
[Nexmo Verify SDK License Agreement][1] and [Privacy Policy][2].

You may not use, exercise any rights with respect to or exploit this SDK,
or any modifications or derivative works thereof, except in accordance with the License.

 [1]: https://www.nexmo.com/terms-use/verify-sdk/
 [2]: https://www.nexmo.com/privacy-policy/
