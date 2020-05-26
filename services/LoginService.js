import axios from 'axios';
import config from '../constants/Config';

const LoginService = () => {
  let subscribers = {};

  const services = {
    logoutAsync: async (setStatus) => {
      return axios.post(config.serverUrl + '/logout')
        .then(response => {
          console.log('Received from logout: ' + JSON.stringify(response.data));
          services.setLoginStatus(false);
        })
    },
    loginAsync: async (username, password, setStatus) => {
      console.log('Will try to login at', config.serverUrl + '/login', 'with', {username, password})
      setStatus && setStatus('Trying to login');
      return axios.post(config.serverUrl + '/login', {username, password})
        .then(response => {
          console.log('Received from login: ' + JSON.stringify(response.data && response.data.status));
          return response && response.data && response.data.status;
        })
        .then(response => {
          setStatus && setStatus( response ? 'Login ok' : 'Inloggningsfel!!');
          services.setLoginStatus(response);
          return response;
        })
        .catch((error) => {
          const aMessage = (error && error.message);
          if (error.response && error.response.status === 401) {
            setStatus && setStatus('Fel email/lösen');
          } else {
            console.log('Login SNAFU:', arguments);
          }
          services.setLoginStatus(false, aMessage);
        });
    },

    checkLogin: (setStatus) => {
      const message = 'Checking login on ' + config.serverUrl;
      console.log(message);
      setStatus && setStatus(message);
      return axios.get(config.serverUrl + '/isLoggedIn')
        .then(serverResponse => {
          const loginStatus = serverResponse && serverResponse.data.status;
          services.setLoginStatus(loginStatus);
          console.log("isLoggedIn Response =>", loginStatus);
          setStatus && setStatus(loginStatus ? 'Login ready' : 'Not logged in!');
          return loginStatus;
        })
        .catch(error => {
          console.log('Returned', error);
          setStatus && setStatus('Error checking login:' + error && error.message);
          services.setLoginStatus(false, error && error.message);
          return false;
        });
    },
    subscribe: (sub) => {
      subscribers[sub] = sub;
    },
    setLoginStatus: (status, error) => {
      Object.values(subscribers).forEach((sub) => sub(status, error))
    },
    unsubscribe: (sub) => {
      delete subscribers[sub];
    },
  };
  return services;
};

export const loginService = LoginService();
