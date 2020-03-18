import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import config from '../constants/Config';
import axios from "axios";

export const registerForPushNotificationsAsync = async function (setStatusMessage) {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    console.log('No notification permissions!');
    return;
  }
  setStatusMessage && setStatusMessage('Push allowed:' + status);

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  setStatusMessage && setStatusMessage('Token found:' + token);

  axios.post(config.serverUrl + '/api/users/token', {token})
    .then(serverResponse => {
      setStatusMessage && setStatusMessage('Token sent: ' + JSON.stringify(token));
    })
    .catch(error => {
      console.log('Returned', error);
      setStatusMessage && setStatusMessage('Error sending position:' + error && error.message);
    });

  // Handle notifications that are received or selected while the app
  // is open. If the app was closed and then opened by tapping the
  // notification (rather than just tapping the app icon to open it),
  // this function will fire on the next tick after the app starts
  // with the notification data.
  this._notificationSubscription = Notifications.addListener( () => {
      alert('I received a notification!!');
    }
  );
};