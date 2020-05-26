import Constants from 'expo-constants';
import {Platform} from "react-native";

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

const manifest = Constants.manifest;
const version = Constants.manifest.version + ' ' + (Platform.OS === 'ios'? manifest.ios.buildNumber: manifest.android.versionCode);
console.log('==>Version', version);
let channel = manifest.releaseChannel ? manifest.releaseChannel : 'dev';
let result = {...{Constants},...{channel}, ...config.default, ...config[manifest.releaseChannel],...{version}};

console.log('Channel', channel, 'results in', Object.values(result).length, 'properties for', manifest.releaseChannel);
export default result;
