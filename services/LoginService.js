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
    loginAsync: async (setStatus) => {
      const redirectUrl = AuthSession.getRedirectUrl();
      let authUrl = 'https://www.facebook.com/v6.0/dialog/oauth' + toQueryString({
        client_id: FB_APP_ID,
        redirect_uri: redirectUrl,
        code: 'code'
      });
      console.log(`Redirect URL (add this to Facebook): ${redirectUrl}`);
      console.log(`AuthURL is:  ${authUrl}`);
      setStatus && setStatus('');
      const result = await AuthSession.startAsync({authUrl: authUrl})
        .catch(error => {
          log.info('Login failed', error && error.message);
        });

      if (result.type === 'success') {
        console.log('Login success!' + JSON.stringify(result, null, 2));
        setStatus && setStatus('So now we are logged in to FB!');

        return axios.get(config.serverUrl + '/auth/facebook/callback2?code=' + result.params.code)
          .then((response) => {
            console.log('received from login: ' + JSON.stringify(response.data));
            setStatus && setStatus('Received login data: ' + response);
            return response && response.data && response.data.status;
          })
          .then(response => {
            setStatus && setStatus('Login done!');
            services.setLoginStatus(true);
            return response;
          })
          .catch((error) => {
            const aMessage = 'Error login: ' + error && error.message;
            setStatus && setStatus(aMessage);
            services.setLoginStatus(false, aMessage);
            console.log('SNAFU', aMessage);
          });

      } else {
        if (result.type === 'cancel') {
          setStatus && setStatus('Login cancelled!');
          services.setLoginStatus(false);
        } else {
          if (result.type === 'error') {
            setStatus && setStatus('Login error!');
            services.setLoginStatus(false, result.message);
          } else {
            setStatus && setStatus('Unknown result type: ' + result.type);
            services.setLoginStatus(false, result.message);
          }
        }
        return Promise.resolve(false);
      }
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
      console.log('Has added subscriber!');
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
