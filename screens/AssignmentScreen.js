import React, {useState, useContext, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import {statusService} from '../services/StatusService';
import AssignmentContext     from '../components/AssignmentContext';
import StatusTextContext from "../components/StatusTextContext";
import {showLocation} from 'react-native-map-link'
import {assignmentService}   from '../services/AssignmentService';

export default function AssignmentScreen({navigation}) {
  const [status, setStatus]         = useContext(StatusTextContext);
  const [assignment, setAssignment] = useContext(AssignmentContext);
  const [buttons, setButtons]       = useState([]);
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');

  const navigateToTarget = () => {
    showLocation({...assignment.position})
      .then(() => console.log('Navigation launched!'))
      .catch(error => consol.log('Launch navigation error', error && error.message));
  };

  useEffect( () => {
    console.log('Processing after assignment changed', assignment !== null);
    if (assignment && assignment.latestStatus) {
      console.log('Handling assignment state', assignment.latestStatus.status);
      switch (assignment.latestStatus.status) {
        case 'QUERIED':
          assignmentService.sendAssignmentStatus(assignment._id, 'received')();
          setCaseDescription('');
          break;
        case 'RECEIVED':
          setButtons([
            {text: 'Acceptera', style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'accept')},
            {text: 'Avböj',     style:styles.redColorOption,   fun: assignmentService.sendAssignmentStatus(assignment._id, 'reject')}]);
          setCaseDescription('');
          break;
        case 'ACCEPTED':
          setButtons([
            {text: 'Åker',   style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'moving')},
            {text: 'Framme', style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'at_goal')},
            {text: 'Klar',   style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'ready')}]);
          setCaseDescription(assignment.beskrivning);
          break;
        case 'MOVING':
          setButtons([
            {text: 'Navigera', style:styles.blueColorOption, fun: navigateToTarget},
            {text: 'Framme', style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'at_goal')},
            {text: 'Klar',   style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'ready')}]);
          setCaseDescription(assignment.beskrivning);
          break;
        case 'AT_GOAL':
          setButtons([
            {text: 'Klar', style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'ready')}]);
          setCaseDescription(assignment.beskrivning);
          break;
        case 'READY':
          setButtons([
            {text: 'Åker hem', fun: assignmentService.sendAssignmentStatus(assignment._id, 'moving_home')},
            {text: 'Hemma',    fun: assignmentService.sendAssignmentStatus(assignment._id, 'at_home')}]);
          setCaseDescription(assignment.beskrivning);
          break;
        case 'MOVING_HOME':
          setButtons([
            {text: 'Hemma', style:styles.greenColorOption, fun: assignmentService.sendAssignmentStatus(assignment._id, 'at_home')}]);
          setCaseDescription('');
          break;
        case 'CANCELED':
        case 'REJECTED':
        case 'AT_HOME':
          setButtons([]);
          setAssignment(null);
          setTimeout(() => statusService.getAvailableStatus(setStatus), 100);
          navigation.navigate('Status');
          setCaseDescription('');
          break;
      }
    } else {
      console.log('No latestStatus', assignment);
      setTimeout(() => statusService.getAvailableStatus(setStatus), 100);
      navigation.navigate('Status');
    }
  }, [assignment]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => assignmentService.checkForAssignment()}>
          <Image source ={require('../assets/images/icon.png')}  style={styles.optiresImage}/>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        {assignment?
          <View>
            <Text style={styles.assignmentTitle}>{caseTitle}</Text>
            <Text style={styles.assignmentText}>{caseDescription}</Text>
          </View>
          : <Text>No assignment</Text>
        }
        { buttons.map((button, i) => {
            return (
              <View style={styles.statusButtonContainer} key={i}>
                <TouchableOpacity onPress={button.fun} style={[styles.statusButton,button.style]}>
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
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  loginButtonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  statusButton: {
    marginVertical: 7,
    paddingVertical: 8,
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
  blueColorOption: {
    borderColor: 'darkblue',
    backgroundColor: 'blue',
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