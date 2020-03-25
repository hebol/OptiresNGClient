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
import StatusTextContext from './components/StatusTextContext';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const statusHook = useState(null);
  const [statusText, setStatusText] = useState('Ok');
  const [status, setStatus] = useContext(StatusContext);
  const statusTextHook = newText => {
    return setStatusText(newText)
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
          <StatusTextContext.Provider value={[statusText, statusTextHook]}>
          <StatusContext.Provider value = {statusHook}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
            <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
              <Stack.Navigator>
                <Stack.Screen name="Root" component={BottomTabNavigator} style={styles.container} />
              </Stack.Navigator>
            </NavigationContainer>
          </StatusContext.Provider>
          </StatusTextContext.Provider>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0096FF',
  },
  statusText: {
    margin: 20,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  }
});
