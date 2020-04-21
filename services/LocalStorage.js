import {AsyncStorage} from 'react-native';

const LocalStorage = () => {
  const returnValue = {
    readObject: async (key, defaultValue) => {
      return AsyncStorage.getItem(key)
        .then(value => {
          if (value) {
            return JSON.parse(value)
          } else {
            return defaultValue;
          }
        })
    },
    storeObject: async (key, value) => {
      return AsyncStorage.setItem(key, JSON.stringify(value));
    },
  };

  return returnValue;
}

export const localStorage = LocalStorage();
