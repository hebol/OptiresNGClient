import React, {useState, useContext} from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

import StatusContext from './components/StatusContext';
import SystemStatusContext from './components/SystemStatusContext';
import StatusTextContext from './components/StatusTextContext';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const statusHook = useState(null);

  const [statusText, setStatusText] = useState('...');
  const statusTextHook = newText => {
    return setStatusText(newText)
  };
  const [systemStatus, setSystemStatus] = useState({color:'gray'});
  const systemStatusHook = newValue => {
    return setSystemStatus(newValue)
  };

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
        <SystemStatusContext.Provider value={[systemStatus, systemStatusHook]}>
          <StatusTextContext.Provider value={[statusText, statusTextHook]}>
            <StatusContext.Provider value = {statusHook}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
              <NavigationContainer style={styles.navigationContainer} ref={containerRef} initialState={initialNavigationState}>
                <Stack.Navigator>
                  <Stack.Screen name="Root" component={BottomTabNavigator} style={styles.container} />
                </Stack.Navigator>
              </NavigationContainer>
            </StatusContext.Provider>
          </StatusTextContext.Provider>
        </SystemStatusContext.Provider>
        <View style={styles.statusView}>
          <View style={[styles.statusCircle, {backgroundColor: (systemStatus.color)}]}/>
          <Text style={styles.statusText}>{statusText}</Text>
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
    margin: 20,
    backgroundColor: '#0096FF',
  },
  statusCircle: {
    width:           30,
    height:          30,
    borderRadius:    15
  },
  statusText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    flexGrow: 1,
  }
});
