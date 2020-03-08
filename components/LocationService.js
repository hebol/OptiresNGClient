import * as TaskManager from 'expo-task-manager';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


const LocationService = () => {
  let subscribers = {};
  let location = {
    latitude: 0,
    longitude: 0
  };

  return {
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
      console.log('Has added subscriber!');
    },
    setLocation: (coords) => {
      location = coords;
      Object.values(subscribers).forEach((sub) => sub(location))
    },
    unsubscribe: (sub) => {
      delete subscribers[sub];
    },
    startLocationTracking: async () => {
      console.log('Will start location tracking!');
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      Location.startLocationUpdatesAsync('RECEIVE_LOCATION_TASK', {
        accuracy: Location.Accuracy.High,
        showsBackgroundLocationIndicator: true,
        distanceInterval: 1000
      })
      .then(response => {
        console.log('received response from service', response);
      })
      .catch(error => {
        console.log('received error from service', error);
      });
    },
    stopLocationTracking: async () => {
      Location.stopLocationUpdatesAsync('RECEIVE_LOCATION_TASK')
        .then(response => {
          console.log('received response from service', response);
        })
        .catch(error => {
          console.log('received error from service', error);
        });
    },
    getCurrentLocation: async () => {
      console.log('Will get current location');
      if (await locationService.isAllowedLocationTracking()) {
        return Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High})
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

      Location.startLocationUpdatesAsync('RECEIVE_LOCATION_TASK', {
        accuracy: Location.Accuracy.High,
        showsBackgroundLocationIndicator: true
      })
        .then(response => {
          console.log('received response from service', response);
        })
        .catch(error => {
          console.log('received error from service', error);
        });
    }
  }
};

export const locationService = LocationService();

TaskManager.defineTask('RECEIVE_LOCATION_TASK', ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  console.log('Received new locations', locations);
  locationService.setLocation(locations);
});

