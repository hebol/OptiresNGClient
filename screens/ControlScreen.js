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
import {statusService} from "../services/StatusService";

export default function ControlScreen({navigation}) {
  const [statusMessage, setStatusMessage] = useState('');
  const [status, setStatus]               = useContext(StatusContext);

  useEffect(() => {
    if (status !== 'NOT_AVAILABLE') {
      locationService.startLocationTracking();
    } else {
      locationService.stopLocationTracking();
    }
  }, [status]);

  useEffect(() => {
    console.log('ControlScreen init');
    navigation.navigate('Login');
    loginService.subscribe(isLoggedIn => {
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
        setStatus(aStatus);
      });
    });

    AppState.addEventListener('change', (newState) => {
      console.log('New app state', newState);
      if (newState === 'active') {
        axios.get(config.serverUrl + '/api/assignments/findAssignmentsForCurrentUser')
          .then(response => {
            if (response && response.data && response.data.length > 0) {
              handleAssignmentReceived(response.data[0]);
            }
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
