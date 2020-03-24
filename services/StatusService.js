import axios from "axios";
import config from '../constants/Config';

const StatusService = () => {

  return {
    setIsAvailableStatus: (status, statusFunction) => {
      statusFunction('Setting status');
      return axios.post(config.serverUrl + '/api/userstatus', {status: status? 'AVAILABLE' : 'NOT_AVAILABLE'})
        .then(serverResponse => {
          statusFunction && statusFunction('Status sent: ' + JSON.stringify(serverResponse.status));
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
          return serverResponse;
        })
        .catch(error => {
          console.log('Returned', error);
          statusFunction && statusFunction('Error fetching status:' + error && error.message);
        });
    }
  }
};

export const statusService = StatusService();
