import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, View } from 'react-native';
import axios from 'axios';
import config from '../constants/Config';
import moveToBottom from '../components/moveToBottom'

import {notificationService} from '../services/NotificationService';
import {loginService}        from '../services/LoginService';
import {locationService}     from '../services/LocationService';
import { AppState }          from 'react-native';
import StatusContext         from '../components/StatusContext';
import SystemStatusContext   from '../components/SystemStatusContext';
import {statusService}       from '../services/StatusService';

export default function ControlScreen({navigation}) {
  const [statusMessage, setStatusMessage] = useState('');
  const [status, setStatus]               = useContext(StatusContext);
  const [systemStatus, setSystemStatus]   = useContext(SystemStatusContext);

  useEffect(() => {
    console.log('ControlScreen init');
    navigation.navigate('Login');

    notificationService.registerForPushNotificationsAsync(setStatusMessage, (notification) => {
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
          locationService.startLocationTracking();
          navigation.navigate('Navigation');
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
      isLoggedIn && statusService.getAvailableStatus(setStatus);
    });

    AppState.addEventListener('change', (newState) => {
      console.log('New app state', newState);
      if (newState === 'active') {
        axios.get(config.serverUrl + '/api/assignments/findAssignmentsForCurrentUser')
          .then(response => {
            if (response && response.data && response.data.length > 0) {
              handleAssignmentReceived(response.data[0]);
            }
          })
          .catch(error => {
            console.log('Error finding assignments', error && error.message);
          });
      }
    });
  }, []);

  function handleAssignmentReceived(assignment) {
    const newState = {...status};
    newState.assignment = assignment;
    console.log('Setting status to', newState);
    setStatus(newState);

    if (assignment && assignment.latestStatus && assignment.latestStatus.status === 'QUERIED') {
      axios.post(config.serverUrl + '/api/assignments/' + assignment._id + '/received')
        .then(response => {
          console.log('Confirmed delivery', response.data);
          if (response.status === 200) {
            handleAssignmentReceived(response.data)
          }
        })
        .catch(error => {
          console.log('Error confirming assignments', error && error.message);
        });

    }
    navigation.navigate('Assignment');
  }

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
