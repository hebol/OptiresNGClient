import React, {useState, useContext} from 'react';
import {Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

import AssignmentContext   from './components/AssignmentContext';
import UserStatusContext   from './components/UserStatusContext';
import SystemStatusContext from './components/SystemStatusContext';
import StatusTextContext   from './components/StatusTextContext';
import config from './constants/Config';
import {loginService} from "./services/LoginService";
import {statusService} from "./services/StatusService";

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const userStatusHook = useState(null);

  const [assignment, setAssignment] = useState(null);
  const assignmentHook = anAssignment => {
    return setAssignment(anAssignment)
  };

  const [statusText, setStatusText] = useState('...');
  const statusTextHook = newText => {
    return setStatusText(newText)
  };
  const [systemStatus, setSystemStatus] = useState({color:'gray', text: config.channel, version: config.version, isLoggedIn: false});
  const systemStatusHook = newValue => {
    return setSystemStatus({...systemStatus,...newValue})
  };

  const confirmLogout = () => {
    Alert.alert("Logga ut","Är du säker du vill logga ut?",
      [ { text: "Avbryt", style: "cancel" },
        { text: "OK", onPress: () => {
          statusService.setIsAvailableStatus(false)
            .then(() => loginService.logoutAsync())
          } }
      ],
      { cancelable: true }
    );
  }

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        //setStatusText('Starting application');
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <AssignmentContext.Provider value={[assignment, assignmentHook]}>
          <SystemStatusContext.Provider value={[systemStatus, systemStatusHook]}>
            <StatusTextContext.Provider value={[statusText, statusTextHook]}>
              <UserStatusContext.Provider value = {userStatusHook}>
                  {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                <NavigationContainer style={styles.navigationContainer} ref={containerRef} initialState={initialNavigationState}>
                  <Stack.Navigator>
                    <Stack.Screen name="Root" component={BottomTabNavigator} style={styles.container} />
                  </Stack.Navigator>
                </NavigationContainer>
              </UserStatusContext.Provider>
            </StatusTextContext.Provider>
          </SystemStatusContext.Provider>
        </AssignmentContext.Provider>
        <View style={styles.statusView}>
          <View style={[styles.statusCircle, {backgroundColor: (systemStatus.color)}]}>
            <Text style={styles.channelText}>{systemStatus.text}</Text>
          </View>
          <Text style={styles.statusText}>{statusText}</Text>
          {systemStatus.isLoggedIn && <TouchableOpacity onPress={confirmLogout}>
            <Text style={styles.logoutButton}>Logga ut</Text>
          </TouchableOpacity>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'flex-start',
    backgroundColor: '#0096FF',
  },
  navigationContainer: {
  },
  statusView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',

    margin: 20,
    backgroundColor: '#0096FF',
  },
  statusCircle: {
    width:        30,
    height:       30,
    borderRadius: 15
  },
  statusText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    flexGrow: 1,
  },
  channelText: {
    paddingTop: 4,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center'
  },
  logoutButton: {
    paddingTop: 4,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fff',
    borderRadius: 5
  }
});
