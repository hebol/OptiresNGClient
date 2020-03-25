import axios from 'axios';
import config from '../constants/Config';

const StatusService = () => {
  let subscribers = {};

  const returnValue = {
    subscribe: (sub) => {
      subscribers[sub] = sub;
      console.log('Has added status subscriber!');
    },

    transmitStatus: (status) => {
      const aStatus = {...status};
      Object.values(subscribers).forEach((sub) => sub(aStatus));
    },


    unsubscribe: (sub) => {
      console.log('Has removed status subscriber!');
      delete subscribers[sub];
    },

    setIsAvailableStatus: (status, statusFunction) => {
      statusFunction('Setting status');
      return axios.post(config.serverUrl + '/api/userstatus', {status: status? 'AVAILABLE' : 'NOT_AVAILABLE'})
        .then(serverResponse => {
          statusFunction && statusFunction('Status sent: ' + JSON.stringify(serverResponse.status));
          returnValue.transmitStatus(serverResponse.status);
          return status;
        })
        .catch(error => {
          console.log('Returned', error);
          statusFunction && statusFunction('Error sending status:' + error && error.message);
        });
    },
    getAvailableStatus: async (statusFunction) => {
      console.log('Will get current status');
      return axios.get(config.serverUrl + '/api/userstatus')
        .then(serverResponse => {
          statusFunction && statusFunction('Received status: ' + JSON.stringify(serverResponse.data));
          console.log('Received status', serverResponse.data);
          returnValue.transmitStatus(serverResponse.data.status);
          return serverResponse;
        })
        .catch(error => {
          console.log('Returned', error);
          statusFunction && statusFunction('Error fetching status:' + error && error.message);
        });
    }
  };
  return returnValue;
};

export const statusService = StatusService();
