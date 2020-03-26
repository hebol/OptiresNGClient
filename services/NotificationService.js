import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import config from '../constants/Config';
import axios from "axios";

const NotificationService = () => {
  return {
    registerForPushNotificationsAsync: async function (setStatusMessage) {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      // Stop here if the user did not grant permissions
      if (status !== 'granted') {
        console.log('No notification permissions!');
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
          setStatusMessage && setStatusMessage('Token sent: ' + JSON.stringify(token));

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
    }
  };
};

export const notificationService = NotificationService();
