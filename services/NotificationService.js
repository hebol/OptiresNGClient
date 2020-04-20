import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import config from '../constants/Config';
import axios from "axios";
import Constants from 'expo-constants';
import {loginService}        from '../services/LoginService';

const NotificationService = () => {
  let subscribers = {};
  let foundToken;
  let hasSentToken = false;
  let _notificationSubscription;

  const result = {
    sendTokenToServer: function(setStatusMessage) {
      if (foundToken && !hasSentToken) {
//        console.log('Will send token', foundToken, 'to server');
        axios.post(config.serverUrl + '/api/users/token', {token: foundToken})
          .then(serverResponse => {
//            console.log('Registered token on server');
            hasSentToken = true;
          })
          .catch(error => {
            console.log('==> ERROR Post token Returned', error);
            setStatusMessage && setStatusMessage('Error sending token:' + error && error.message);
            _notificationSubscription = null;
          });
      } else {
        console.log('Token not found yet, or already sent!', {foundToken, hasSentToken});
      }
    },
    subscribe: function(sub) {
      subscribers[sub] = sub;
    },
    notify: function(notification) {
      Object.values(subscribers).forEach((sub) => sub(notification))
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

        if (Platform.OS === 'android') {
          const channelId = 'assignments';
          Notifications.createChannelAndroidAsync(channelId, {
            name: 'OptiresNG Uppdrag',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
          });
        }

        foundToken = await Notifications.getExpoPushTokenAsync();
        result.sendTokenToServer(setStatusMessage);

        // Has initialization already been performed?
        if (!_notificationSubscription) {
          _notificationSubscription = Notifications.addListener( function(notification) {
              console.log('Received Notification of type : ', (notification && notification.data &&  notification.data.type));
              result.notify(notification.data);
            }
          );

          setStatusMessage && setStatusMessage('Token found:' + foundToken);
        } else {
          console.log('Already registered for notifications!');
        }
      } else {
        console.log('No notifications, running in emulator');
      }
    }
  };
  return result;
};

export const notificationService = NotificationService();
