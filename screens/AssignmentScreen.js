import React, {useState, useContext, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import moveToBottom from '../components/moveToBottom'

import {statusService} from '../services/StatusService';
import AssignmentContext     from '../components/AssignmentContext';
import axios from "axios";
import config from "../constants/Config";
import StatusTextContext from "../components/StatusTextContext";

export default function AssignmentScreen({navigation}) {
  const [status, setStatus]         = useContext(StatusTextContext);
  const [assignment, setAssignment] = useContext(AssignmentContext);
  const [buttons, setButtons]       = useState([]);

  const checkForAssignment = () => {
    axios.get(config.serverUrl + '/api/assignments/findAssignmentsForCurrentUser')
    .then(response => {
      if (response && response.data && response.data.length > 0) {
        setAssignment(response.data[0]);
      }
    })
    .catch(error => {
      console.log('Error finding assignments', error && error.message);
    });
  };

  function sendAssignmentStatus(aStatus) {
    return () => {
      axios.post(config.serverUrl + '/api/assignments/' + assignment._id + '/' + aStatus)
      .then(response => {
        console.log('Confirmed delivery', response.data);
        return checkForAssignment();
      })
      .catch(error => {
        console.log('Error confirming assignments', error && error.message);
      });
    };
  }

  useEffect( () => {
    if (assignment && assignment.latestStatus) {
      console.log('Handling assignment state', assignment.latestStatus.status);
      switch (assignment.latestStatus.status) {
        case 'QUERIED':
          sendAssignmentStatus('received')();
          break;
        case 'RECEIVED':
          setButtons([
            {text: 'Acceptera', fun: sendAssignmentStatus('accept')},
            {text: 'Avböj', fun: sendAssignmentStatus('reject')}]);
          break;
        case 'ACCEPTED':
          setButtons([
            {text: 'Åker', fun: sendAssignmentStatus('moving')},
            {text: 'Framme', fun: sendAssignmentStatus('at_goal')},
            {text: 'Klar', fun: sendAssignmentStatus('ready')}]);
          break;
        case 'MOVING':
          setButtons([
            {text: 'Framme', fun: sendAssignmentStatus('at_goal')},
            {text: 'Klar', fun: sendAssignmentStatus('ready')}]);
          break;
        case 'AT_GOAL':
          setButtons([
            {text: 'Klar', fun: sendAssignmentStatus('ready')}]);
          break;
        case 'READY':
          setButtons([
            {text: 'Hemma', fun: sendAssignmentStatus('at_home')}]);
          break;
        case 'REJECTED':
        case 'AT_HOME':
          setButtons([]);
          navigation.navigate('Status');
          break;
      }
    }
  }, [assignment]);

  useEffect( () => {
    checkForAssignment();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => statusService.getAvailableStatus(setStatus)}>
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
        { buttons.map((button, i) => {
            return (
              <View style={styles.statusButtonContainer} key={i}>
                <TouchableOpacity onPress={button.fun} style={styles.statusButton}>
                  <Text style={styles.statusText}>{button.text}</Text>
                </TouchableOpacity>
              </View>
            )
          })
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
  loginButtonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  statusButton: {
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 10,
  },
  statusText: {
    fontSize: 30,
    color: '#fff',
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
});