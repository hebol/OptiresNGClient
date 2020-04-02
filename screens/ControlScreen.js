import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, View } from 'react-native';

import {notificationService} from '../services/NotificationService';
import {loginService}        from '../services/LoginService';
import {locationService}     from '../services/LocationService';
import { AppState }          from 'react-native';
import StatusContext         from '../components/StatusContext';
import StatusTextContext     from '../components/StatusTextContext';
import SystemStatusContext   from '../components/SystemStatusContext';
import {statusService}       from '../services/StatusService';

export default function ControlScreen({navigation}) {
  const [status, setStatus]             = useContext(StatusContext);
  const [statusText, setStatusText]     = useContext(StatusTextContext);
  const [systemStatus, setSystemStatus] = useContext(SystemStatusContext);

  useEffect(() => {
    console.log('ControlScreen init');
    navigation.navigate('Login');

    notificationService.registerForPushNotificationsAsync(setStatusText, (notification) => {
        console.log('Notification: ', notification);
        switch (notification.data && notification.data.type) {
          case 'TEST_MESSAGE':
            alert('I received a test notification!! '  + JSON.stringify(notification));
            break;
          case 'ASSIGNMENT':
            alert('I received an assignment!! '  + JSON.stringify(notification));
            break;
        }
      }
    );
    statusService.subscribe(aStatus => {
      console.log('Control screen Setting status to', aStatus);
      setStatusText(aStatus);
      setStatus(aStatus);
      switch (aStatus) {
        case 'AVAILABLE':
          locationService.startLocationTracking();
          navigation.navigate('Status');
          break;

        case 'NOT_AVAILABLE':
          locationService.stopLocationTracking();
          navigation.navigate('Status');
          break;

        case 'ON_ASSIGNMENT':
        case 'MOVING_HOME':
          locationService.startLocationTracking();
          navigation.navigate('Assignment');
          break;

        default:
        case 'UNKNOWN':
        case undefined:
          console.log('Handling status', aStatus, 'as default');
          locationService.stopLocationTracking();
          break;
      }
    });

    loginService.subscribe((isLoggedIn, error) => {
      setSystemStatus( {color: isLoggedIn ? 'green' : (error? 'red' : 'grey')});
      isLoggedIn && statusService.getAvailableStatus(setStatusText);
    });

    AppState.addEventListener('change', (newState) => {
      console.log('New app state', newState);
      if (newState === 'active') {
        loginService.checkLogin(setStatusText);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0096FF",
  },
});
