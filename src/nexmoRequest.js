import axios from 'axios';

const nexmoRequest = axios.create({
  baseURL: 'https://api.nexmo.com/sdk/',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
    'Content-Encoding': 'UTF-8',
    'X-NEXMO-SDK-OS-FAMILY': 'JS',
    'X-NEXMO-SDK-REVISION': '0.2',
  },
});

export default nexmoRequest;
