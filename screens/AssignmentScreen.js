import React, {useState, useContext, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import moveToBottom from '../components/moveToBottom'

import {statusService} from '../services/StatusService';
import StatusContext from "../components/StatusContext";
import AssignmentContext     from '../components/AssignmentContext';
import axios from "axios";
import config from "../constants/Config";

/*

      <View style={styles.assignmentContainer}>
        (status && status.assignment ?
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
  const [assignment, setAssignment]       = useContext(AssignmentContext);

  useEffect( () => {
    if (assignment && assignment.latestStatus && assignment.latestStatus.status === 'QUERIED') {
      axios.post(config.serverUrl + '/api/assignments/' + assignment._id + '/received')
        .then(response => {
          console.log('Confirmed delivery', response.data);
        })
        .catch(error => {
          console.log('Error confirming assignments', error && error.message);
        });
    }
  }, [assignment]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => statusService.getAvailableStatus(setStatusMessage)}>
          <Image source ={require('../assets/images/icon.png')}  style={styles.optiresImage}/>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
      {assignment?
        <View>
          <Text style={styles.assignmentTitle}>{assignment.titel}</Text>
          <Text style={styles.assignmentText}>{assignment.beskrivning}</Text>
          <Text>We have an assignment {assignment.currentStatus}</Text>
        </View>
        : <Text>No assignment</Text>
      }
      </View>

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