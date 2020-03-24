import React, {useState, useEffect} from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import moveToBottom from '../components/moveToBottom'

import {loginService} from '../services/LoginService';

export default function LoginScreen({navigation}) {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined);
  const [statusMessage, setStatusMessage] = useState('');
  console.log('Login Screen');

  useEffect(() => {
    checkLogin()
      .then(status => {
        setStatusMessage('Login status:' + status);
        if (status) {
          navigation.navigate('Status');
        }
      });
  }, []);

  const checkLogin = () => {
    return loginService.checkLogin(setIsLoggedIn,setStatusMessage);
  };
  const loginAsync = () => {
    return loginService.loginAsync(setStatusMessage)
      .then(status => status && navigation && navigation.navigate('Status'))
  };


  return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <TouchableOpacity onPress={checkLogin}>
            <Image source ={require('../assets/images/icon.png')}  style={styles.loginImage}/>
            {(isLoggedIn === true ? <Text>Is Logged in! </Text> :
              (isLoggedIn === undefined ? <Text>Looking for status! </Text> :
                <Text>Is NOT Logged in!</Text>))}
            </TouchableOpacity>
          </View>

          <View style={styles.loginButtonContainer}>
            <TouchableOpacity onPress={loginAsync} style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

          {moveToBottom(
            <View style={styles.loginContainer}>
              <DevelopmentModeNotice/>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>)
          }
        </ScrollView>
      </View>
  );
}

LoginScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools.
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0096FF",
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
    bottom: 0,
  },
  contentContainer: {
    paddingTop: 30,
    height: '100%',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  loginContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  statusContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    bottom: 0,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  loginButtonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 10,
  },
  loginText: {
    fontSize: 30,
    color: '#fff',
  },
  statusText: {
    marginBottom: 20,
    fontSize: 14,
    color: '#fff',
  },
});
