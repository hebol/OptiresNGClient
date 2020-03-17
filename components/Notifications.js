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
    alert('No notification permissions!');
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  axios.post(config.serverUrl + '/api/users/token', {token})
    .then(serverResponse => {
      setStatusMessage && setStatusMessage('Token sent: ' + JSON.stringify(token));
    })
    .catch(error => {
      console.log('Returned', error);
      setStatusMessage && setStatusMessage('Error sending position:' + error && error.message);
    });
}