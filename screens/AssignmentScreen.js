import React, {useState, useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import moveToBottom from '../components/moveToBottom'

import {statusService} from '../services/StatusService';
import StatusContext from "../components/StatusContext";

/*

      <View style={styles.assignmentContainer}>
        (status && status.assignment ?
        <Text style={styles.assignmentTitle}>Titel:{status.assignment.titel}</Text>
        <Text style={styles.assignmentText}>Beskrivning:{status.assignment.beskrivning}</Text>
        <Text style={styles.assignmentStatus}>Status:{status.assignment.currentStatus}</Text>
        : <Text></Text>)
      </View>
      <View>
      {(status.assignment.latestStatus && status.assignment.latestStatus.status === 'RECEIVED'?
          <Text style={styles.assignmentText}>Skall du åka</Text> :
          <Text style={styles.assignmentText}>Annan status</Text>
      )}
      </View>


 */

export default function AssignmentScreen() {
  const [statusMessage, setStatusMessage] = useState('');
  const [status, setStatus]               = useContext(StatusContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => statusService.getAvailableStatus(setStatusMessage)}>
          <Image source ={require('../assets/images/icon.png')}  style={styles.optiresImage}/>
        </TouchableOpacity>
      </View>
      { moveToBottom(
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusMessage}</Text>
        </View>)
      }

    </ScrollView>
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
  assignmentContainer: {
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