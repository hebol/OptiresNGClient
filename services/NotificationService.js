import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import config from '../constants/Config';
import axios from "axios";
import Constants from 'expo-constants';

const NotificationService = () => {
  let subscribers = {};

  return {
    subscribe: (sub) => {
      subscribers[sub] = sub;
      console.log('Has added subscriber!');
    },
    notify: (notification) => {
      const location = coords;
      Object.values(subscribers).forEach((sub) => sub(location))
    },
    unsubscribe: (sub) => {
      delete subscribers[sub];
    },
    listenToNotifications: async function (setStatusMessage) {
      if (Constants.isDevice) {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

        // Stop here if the user did not grant permissions
        if (status !== 'granted') {
          console.log('No notification permissions!');
          setStatusMessage && setStatusMessage('No Push permissions!');
          return;
        } else {
          setStatusMessage && setStatusMessage('Push allowed:' + status);
        }

        // Has initialization already been performed?
        if (!this._notificationSubscription) {
          let token = await Notifications.getExpoPushTokenAsync();
          setStatusMessage && setStatusMessage('Token found:' + token);

          axios.post(config.serverUrl + '/api/users/token', {token})
            .then(serverResponse => {
              this._notificationSubscription = Notifications.addListener( (notification) => {
                  console.log('Notification: ', notification);
                  alert('I received a notification!!');
                }
              );
            })
            .catch(error => {
              console.log('Post token Returned', error);
              setStatusMessage && setStatusMessage('Error sending position:' + error && error.message);
              this._notificationSubscription = null;
            });
        } else {
          console.log('Already registered for notifications!');
        }
      } else {
        console.log('No notifications, running in emulator');
      }
    }
  };
};

export const notificationService = NotificationService();
