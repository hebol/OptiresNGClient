import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, View } from 'react-native';

import {notificationService} from '../services/NotificationService';
import {loginService}        from '../services/LoginService';
import {locationService}     from '../services/LocationService';
import { AppState }          from 'react-native';
import AssignmentContext     from '../components/AssignmentContext';
import UserStatusContext     from '../components/UserStatusContext';
import StatusTextContext     from '../components/StatusTextContext';
import SystemStatusContext   from '../components/SystemStatusContext';
import {statusService}       from '../services/StatusService';
import {assignmentService}   from '../services/AssignmentService';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask('PING_WITH_SERVER', () => {
  console.log('Pinging server', new Date());
    return statusService.getAvailableStatus()
      .then(async status => {
        if (status === 'AVAILABLE') {
          await statusService.setIsAvailableStatus(status);
        }
        return status;
      })
      .then(status => {
        return status === 'AVAILABLE' ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
      })
      .catch (error => {
        console.log('Error fetching status in background');
        return BackgroundFetch.Result.Failed;
      });
});

export default function ControlScreen({navigation}) {
  const [status, setStatus]             = useContext(UserStatusContext);
  const [assignment, setAssignment]     = useContext(AssignmentContext);
  const [statusText, setStatusText]     = useContext(StatusTextContext);
  const [systemStatus, setSystemStatus] = useContext(SystemStatusContext);

  useEffect(() => {
    console.log('ControlScreen init');

    navigation.navigate('Login');

    notificationService.listenToNotifications(setStatusText);
    notificationService.subscribe((notification) => {
        console.log('Notification: ', notification);
        switch (notification && notification.type) {
          case 'TEST_MESSAGE':
            alert('I received a test notification!! '  + JSON.stringify(notification));
            break;
          case 'ASSIGNMENT':
            setAssignment(notification.assignment);
            statusService.getAvailableStatus(setStatusText);
            break;
        }
      }
    );

    assignmentService.subscribe(assignment => {
      setAssignment(assignment);
    });

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
          assignmentService.checkForAssignment();
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
      isLoggedIn && notificationService.sendTokenToServer(setStatusText);
      !isLoggedIn && navigation.navigate('Login');
      setSystemStatus({isLoggedIn});
    });

    AppState.addEventListener('change', (newState) => {
      console.log('New app state', newState);
      if (newState === 'active') {
        loginService.checkLogin(setStatusText);
      }
    });

    BackgroundFetch.registerTaskAsync('PING_WITH_SERVER', {
      minimumInterval: 15 * 60,
      stopOnTerminate: false,
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
