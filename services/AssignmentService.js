import axios from 'axios';
import config from '../constants/Config';

const AssignmentService = () => {
  let subscribers = {};

  const returnValue = {
    subscribe: (sub) => {
      subscribers[sub] = sub;
    },

    notify: (status) => {
      const aStatus = status;
      Object.values(subscribers).forEach((sub) => sub(aStatus));
    },

    unsubscribe: (sub) => {
      delete subscribers[sub];
    },

    sendAssignmentStatus: (id, aStatus) => {
      return () => {
        return axios.post(config.serverUrl + '/api/assignments/' + id + '/' + aStatus)
          .then(response => {
            return returnValue.checkForAssignment();
          })
          .catch(error => {
            console.log('Error confirming assignments', error && error.message);
          });
      }
    },
    checkForAssignment: () => {
      return axios.get(config.serverUrl + '/api/assignments/findAssignmentForCurrentUser')
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
