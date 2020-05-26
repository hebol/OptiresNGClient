import * as TaskManager from 'expo-task-manager';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import axios from "axios";
import config from "../constants/Config";


const receivedNewLocation = (location) => {
  const value = JSON.stringify(location);
  return sendPosition(location && location.coords);
};

function sendPosition(location) {
  return axios.post(config.serverUrl + '/api/userposition', location)
  .catch(error => {
    console.log('Location post returned error', error);
  });
}

const LocationService = () => {
  let subscribers = {};

  const returnValue = {
    isAllowedLocationTracking: () => {
      return Location.hasServicesEnabledAsync()
        .then ( response => {
          console.log('Has services enabled', response);
          return Location.getPermissionsAsync()
            .then(permission => {
              console.log('Has permissions', JSON.stringify(permission));
              return response && permission.status === 'granted';
            });
        });
    },
    subscribe: (sub) => {
      subscribers[sub] = sub;
    },
    setLocation: (coords) => {
      const location = coords;
      Object.values(subscribers).forEach((sub) => sub(location))
    },
    unsubscribe: (sub) => {
      delete subscribers[sub];
    },
    startLocationTracking: async () => {
      returnValue.subscribe(receivedNewLocation);
      console.log('Will start location tracking!');
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      return Location.startLocationUpdatesAsync('RECEIVE_LOCATION_TASK', {
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        distanceInterval: 1000
      })
      .then(response => {
        console.log('Received response from location service start', response);
      })
      .catch(error => {
        console.log('Received error from service', error);
      });
    },
    stopLocationTracking: async () => {
      console.log('Will stop location tracking!');
      returnValue.unsubscribe(receivedNewLocation);
      Location.hasStartedLocationUpdatesAsync('RECEIVE_LOCATION_TASK')
        .then( status => {
          if (status) {
            return Location.stopLocationUpdatesAsync('RECEIVE_LOCATION_TASK')
              .then(response => {
                console.log('received response from location service STOP', response);
              })
              .catch(error => {
                console.log('received error from service', error);
              });
          } else {
            console.log('Location tracking already turned off');
          }
        })
    },
    getCurrentLocation: async () => {
      console.log('Will get current location');
      if (await locationService.isAllowedLocationTracking()) {
        return Location.getCurrentPositionAsync({accuracy: Location.Accuracy.BestForNavigation})
          .then(location => {
            console.log('Received new location', location);
            return location;
          })
          .catch(error => {
            console.error('Error receiving position', error);
            return null;
          });
      } else {
        return Promise.reject('Not allowed location');
      }
    },
    getNumberOfPositions: () => {
      return axios.get(config.serverUrl + '/api/userposition/count');
    },
  };
  return returnValue;
};

export const locationService = LocationService();

TaskManager.defineTask('RECEIVE_LOCATION_TASK', ({ data: {locations}, error }) => {
  if (error) {
    console.log('Received error for locations', error && error.message);
    return;
  }
  console.log('Received new locations', locations.map(pos => 'Lat: ' + pos.coords.latitude + ', Long: ' + pos.coords.longitude));
  if (!Array.isArray(locations)) {
    console.log('Was not array, creating it');
    locations = [locations];
  }
  locations.forEach(location => locationService.setLocation(location));
});

