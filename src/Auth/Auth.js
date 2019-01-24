import auth0 from 'auth0-js';
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

import AUTH_CONFIG from './auth0-variables';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid profile email',
  });

  userProfile;

  constructor(props = null) {
    if (props) {
      this.dispatch = props.dispatch;
    }
  }

  login = (username, password) => {
    this.auth0.login(
      { realm: AUTH_CONFIG.dbConnectionName, username, password },
      (err, authResult) => {
        if (err) {
          console.error('authResult', authResult);
          alert(`Invalid password or username`);
        }
      }
    );
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  };

  getProfile = cb => {
    const accessToken = this.getAccessToken();

    return this.auth0.client.userInfo(accessToken, cb);
  };

  signup = (email, password) => {
    this.auth0.signup({ connection: AUTH_CONFIG.dbConnectionName, email, password }, err => {
      if (err) {
        console.error('error', err);
        alert(`Error: ${err.description}. Check the console for further details.`);
        return;
      }

      this.auth0.login(
        {
          realm: AUTH_CONFIG.dbConnectionName,
          username: email,
          password,
        },
        (err, authResult) => {
          if (err) {
            console.error(err, authResult);
            alert(`Error: ${err.description}. Check the console for further details.`);
          }
        }
      );
    });
  };

  loginWithGoogle = () => {
    this.auth0.authorize({ connection: 'google-oauth2' });
  };

  loginWithLinkedin = () => {
    this.auth0.authorize({ connection: 'linkedin' });
  };

  loginWithFacebook = () => {
    this.auth0.authorize({ connection: 'facebook' });
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.dispatch(routerRedux.push('/'));
      } else if (err) {
        console.error(err);
        this.dispatch(routerRedux.push('/'));
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  };

  setSession(authResult) {
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.getProfile((err, profile) => {
      if (!err) {
        const { sub, name, email } = profile;
        window.setFullstoryIdentity(sub, name, email);
        window.setEmail(email);
        localStorage.setItem('profile', JSON.stringify(profile));
      } else {
        return this.logout();
      }

      setAuthority('user');
      reloadAuthorized();
      this.dispatch(routerRedux.push('/'));
      return null;
    });
  }

  logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');

    this.userProfile = null;

    setAuthority('guest');
    reloadAuthorized();
    this.dispatch(routerRedux.push('/'));
  };
}
