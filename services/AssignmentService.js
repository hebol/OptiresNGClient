import axios from 'axios';
import config from '../constants/Config';

const AssignmentService = () => {
  let subscribers = {};

  const returnValue = {
    subscribe: (sub) => {
      subscribers[sub] = sub;
      console.log('Has added assignment subscriber!');
    },

    notify: (status) => {
      const aStatus = status;
      Object.values(subscribers).forEach((sub) => sub(aStatus));
    },

    unsubscribe: (sub) => {
      console.log('Has removed assignment subscriber!');
      delete subscribers[sub];
    },

    checkForAssignment: () => {
      axios.get(config.serverUrl + '/api/assignments/findAssignmentForCurrentUser')
        .then(response => {
          if (response && response.data) {
            returnValue.notify(response.data);
          } else {
            returnValue.notify(null);
          }
        })
        .catch(error => {
          console.log('Error finding assignments', error && error.message);
        });
    },
  };
  return returnValue;
};

export const assignmentService = AssignmentService();
