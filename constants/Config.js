import Constants from 'expo-constants';

const config = {
  default: {
    serverUrl: 'https://optiresng.eu.ngrok.io',
  },
  dev: {

  },
  test: {
    serverUrl: 'https://optiresng.herokuapp.com',
  },
  prod: {

  }
};

let channel = Constants.manifest.releaseChannel ? Constants.manifest.releaseChannel : 'dev';
let result = {...{channel}, ...config.default, ...config[Constants.manifest.releaseChannel]};

console.log('Channel', channel, 'results in', Object.values(result).length, 'properties');
export default result;
