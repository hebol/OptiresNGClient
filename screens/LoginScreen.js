import React, {useState, useEffect, useContext} from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CheckBox } from 'react-native-elements';

import { ScrollView } from 'react-native-gesture-handler';
import moveToBottom from '../components/moveToBottom'

import {loginService}    from '../services/LoginService';
import {localStorage}    from '../services/LocalStorage';
import StatusTextContext from "../components/StatusTextContext";

export default function LoginScreen({navigation}) {
  const [statusText, setStatusText] = useContext(StatusTextContext);
  const defaultLoginInfo = {username: '', password: '', saveCredentials:true};
  const [loginInfo, setLoginInfo]   = useState(defaultLoginInfo);
  const handleLoginInfo = (newValue) => {
    setLoginInfo({...loginInfo, ...newValue});
    console.log('New value', loginInfo);
  };

  useEffect(() => {
    localStorage.readObject('LOGIN_INFO', defaultLoginInfo)
      .then(handleLoginInfo);

    checkLogin()
      .then(status => {
        if (status) {
          navigation.navigate('Status');
        }
      });
  }, []);

  useEffect(() => {
    if (loginInfo.saveCredentials) {
      localStorage.storeObject('LOGIN_INFO', loginInfo);
    } else {
      localStorage.storeObject('LOGIN_INFO', defaultLoginInfo);
    }
  }, [loginInfo]);

  const checkLogin = () => {
    return loginService.checkLogin(setStatusText);
  };
  const loginAsync = () => {
    return loginService.loginAsync(setStatusText)
  };

  return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <TouchableOpacity onPress={checkLogin}>
              <Image source ={require('../assets/images/icon.png')}  style={styles.loginImage}/>
            </TouchableOpacity>
          </View>

          <View style={styles.loginButtonContainer}>
            <TextInput editable value={loginInfo.username} onChangeText={text => handleLoginInfo({ username:text })} autoCapitalize={'none'} autoCompleteType={'email'} placeholder={'Email'} style={styles.loginFields}/>
            <TextInput editable value={loginInfo.password} onChangeText={text => handleLoginInfo({ password:text })} autoCapitalize={'none'} autoCompleteType={'password'} placeholder={'Lösenord'} secureTextEntry={true}style={styles.loginFields}/>
          </View>
          <View style={styles.loginButtonContainer}>
            <CheckBox
              size={30}
              textStyle={styles.checkboxText}
              containerStyle={styles.checkbox}
              title='Spara inloggning'
              checked={loginInfo.saveCredentials}
              checkedColor={'#fff'}
              uncheckedColor={'#fff'}
              onPress={() => handleLoginInfo({saveCredentials: !loginInfo.saveCredentials})}/>
            <TouchableOpacity onPress={loginAsync} style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

          {moveToBottom(
            <View style={styles.loginContainer}>
              <DevelopmentModeNotice/>
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
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  loginContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
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
  loginFields: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    width:250,
    height:45,
    padding:5,
    marginBottom:5,
    fontSize: 20,
    color: '#fff',
  },
  loginText: {
    fontSize: 30,
    color: '#fff',
  },
  checkbox: {
    backgroundColor: "#0096FF",
    borderWidth: 0,
  },
  checkboxText: {
    fontSize:20,
    color: '#fff',
  }
});
