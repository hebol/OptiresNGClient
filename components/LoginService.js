import axios from 'axios';
import config from '../constants/Config';
import {AuthSession} from "expo";

const FB_APP_ID = '284161059217962';
function toQueryString(params) {
  var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  return queryString.length > 0 ? '?' + encodeURI(queryString) : '';
}

const LoginService = () => {
  let subscribers = {};

  const services = {
    loginAsync: async (setStatusMessage) => {
      const redirectUrl = AuthSession.getRedirectUrl();
      let authUrl = 'https://www.facebook.com/v6.0/dialog/oauth' + toQueryString({
        client_id: FB_APP_ID,
        redirect_uri: redirectUrl,
        code: 'code'
      });
      console.log(`Redirect URL (add this to Facebook): ${redirectUrl}`);
      console.log(`AuthURL is:  ${authUrl}`);
      setStatusMessage('');
      const result = await AuthSession.startAsync({authUrl: authUrl});

      if (result.type === 'success') {
        console.log('Login success!' + JSON.stringify(result, null, 2));
        setStatusMessage('So now we are logged in to FB!');

        const loginStatus = await axios.get(config.serverUrl + '/auth/facebook/callback2?code=' + result.params.code)
          .then((response) => {
            console.log('received from login: ' + JSON.stringify(response));
            setStatusMessage('Received login data: ' + response);
            return response;
          })
          .then(response => {
            setStatusMessage('Login done!');
            return response;
          })
          .catch((error) => {
            setStatusMessage('Error login: ' + error && error.message);
            console.error('SNAFU' + error);
          });

      } else {
        if (result.type === 'cancel') {
          setStatusMessage('Login cancelled!');
        } else {
          if (result.type === 'error') {
            setStatusMessage('Login error!');
          } else {
            setStatusMessage('Unknown result type: ' + result.type);
          }
        }
      }
    },

    checkLogin: (setIsLoggedIn, setStatusMessage) => {
      setStatusMessage('Checking login');
      return axios.get(config.serverUrl + '/isLoggedIn')
        .then(serverResponse => {
          const loginStatus = serverResponse && serverResponse.data.status;
          setIsLoggedIn(loginStatus);
          services.setLoginStatus(loginStatus);
          console.log("Response", loginStatus);
          setStatusMessage('Login ready');
          return loginStatus;
        })
        .catch(error => {
          console.log('Returned', error);
          setIsLoggedIn(false);
          setStatusMessage('Error checking login:' + error && error.message);
        });
    },
    subscribe: (sub) => {
      subscribers[sub] = sub;
      console.log('Has added subscriber!');
    },
    setLoginStatus: (status) => {
      Object.values(subscribers).forEach((sub) => sub(status))
    },
    unsubscribe: (sub) => {
      delete subscribers[sub];
    },
  };
  return services;
};

export const loginService = LoginService();
