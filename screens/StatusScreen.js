import React, {useState, useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import moveToBottom from '../components/moveToBottom'

import {statusService} from '../services/StatusService';

import StatusContext from "../components/StatusContext";

export default function StatusScreen() {
  const [isAvailable, setIsAvailable]     = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [status, setStatus]               = useContext(StatusContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => statusService.getAvailableStatus(setStatusMessage)}>
          <Image source ={require('../assets/images/icon.png')}  style={styles.optiresImage}/>
        </TouchableOpacity>
      </View>

      <OptionButton icon="md-play" label="Tillgänglig" colorOption={styles.greenColorOption} selected={isAvailable}
                    onPress={() => {
                      statusService.setIsAvailableStatus(true, setStatusMessage)
                        .then(status => {
                          status && setStatusMessage('Nu tillgänglig');
                          setStatus('AVAILABLE');
                          setIsAvailable(status);
                        });
                    }}
      />
      <OptionButton
        icon="md-square" label="Upptagen" colorOption={styles.redColorOption} selected={!isAvailable}
        onPress={() => {
          statusService.setIsAvailableStatus(false, setStatusMessage)
            .then(status => {
              !status && setStatusMessage('Nu inte tillgänglig');
              setIsAvailable(status);
              setStatus('NOT_AVAILABLE');
            });
        }}
        isLastOption
      />

      { moveToBottom(
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>)
      }

    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, selected, colorOption, isLastOption, hide}) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption, selected && styles.selectedOption, hide && styles.hiddenOption, colorOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(255,255,255,0.85)" />
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
    flex: 1,
    paddingTop: 15,
    height: '100%',
  },
  optiresImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  optionTextContainer: {
    marginLeft: 12,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  statusContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    top: 30,
  },
  option: {
    backgroundColor: '#0096FF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
    left: '20%',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hiddenOption: {
    display: 'none',
  },
  selectedOption: {
    paddingVertical: 25,
    borderWidth: 3,
    left:0,
  },
  redColorOption: {
    borderColor: 'darkred',
    backgroundColor: 'red',
  },
  greenColorOption: {
    borderColor: 'darkgreen',
    backgroundColor: 'green',
  },
  optionText: {
    fontSize: 20,
    alignSelf: 'flex-start',
    color: 'white',
    marginTop: 1,
  },
  statusText: {
    marginBottom: 40,
    fontSize: 14,
    color: '#fff',
  },
});