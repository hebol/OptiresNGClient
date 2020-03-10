import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import {locationService} from '../components/LocationService';
import config from '../constants/Config';
import axios from "axios";


export default function NavigationScreen() {
  const [statusMessage, setStatusMessage] = useState('');

  const receivedNewLocation = (location) => {
    const value = JSON.stringify(location);
    console.log('Will set status message', value);
    setStatusMessage('Received location' + value);
    sendPosition(location && location.coords);
  };

  function sendPosition(location) {
    setStatusMessage('Sending position');
    axios.post(config.serverUrl + '/api/userposition', location)
      .then(serverResponse => {
        setStatusMessage('Position sent: ' + JSON.stringify(location));
      })
      .catch(error => {
        console.log('Returned', error);
        setStatusMessage('Error sending position:' + error && error.message);
      });
  }
  const getNumberOfPositions = () => {
    return axios.get(config.serverUrl + '/api/userposition/count');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <OptionButton
        icon="md-play"
        label="Starta följ position"
        onPress={() => {
          console.log('Trying to subscribe!');
          locationService.startLocationTracking();
          locationService.subscribe(receivedNewLocation);
          setStatusMessage('Prenumeration startad');
        }}
      />

      <OptionButton
        icon="md-square"
        label="Sluta följ position"
        onPress={() => {
          locationService.stopLocationTracking();
          locationService.unsubscribe(receivedNewLocation);
          setStatusMessage('Prenumeration avslutad');
        }}
      />

      <OptionButton
        icon="md-apps"
        label="Check permissions"
        onPress={() => {
          locationService.isAllowedLocationTracking()
            .then(response => setStatusMessage(`Is allowed: ${response}`));
        }}
      />

      <OptionButton
        icon="md-compass"
        label="Antal positioner"
        onPress={() => {
          getNumberOfPositions()
            .then(response => {
              setStatusMessage(`Antal positioner: ${response.data.count}, senaste: ${response.data.last.createdAt}`)
            });
        }}
      />

      <OptionButton
        icon="md-locate"
        label="Hämta aktuell position"
        onPress={() => {
          locationService.getCurrentLocation()
            .then(location => {
              console.log('Received', JSON.stringify(location));
              sendPosition(location.coords);
            });
        }}
        isLastOption
      />

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{statusMessage}</Text>
      </View>


    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0096FF',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#0096FF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});