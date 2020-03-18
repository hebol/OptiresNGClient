import React, {useState, useEffect} from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import config from '../constants/Config';
import moveToBottom from '../components/moveToBottom'

import {registerForPushNotificationsAsync} from '../components/Notifications';
import {loginService} from '../components/LoginService';

export default function ControlScreen({navigation}) {
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    console.log('ControlScreen init');
    navigation.navigate('Login');
    loginService.subscribe(isLoggedIn => {
      registerForPushNotificationsAsync(setStatusMessage)
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
