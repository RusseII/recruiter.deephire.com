/* global $crisp */
import auth0 from 'auth0-js';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

import AUTH_CONFIG from './auth0-variables';

export default class Auth {
  tokenRenewalTimeout;

  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: 'http://a.deephire.com',
    responseType: 'token id_token',
    scope: 'openid profile email',
  });

  userProfile;

  constructor(props = null) {
    this.scheduleRenewal();

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
          message.error('Incorrect Email or Password', 10);
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

  signup = (email, password, name, userMetadata) => {
    $crisp.push([
      'set',
      'session:event',
      [[['user-signup', { time: new Date().toString() }, 'green']]],
    ]);
    this.auth0.signup(
      {
        connection: AUTH_CONFIG.dbConnectionName,
        email,
        password,
        name,
        user_metadata: userMetadata,
      },
      err => {
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
      }
    );
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
        // this.dispatch(routerRedux.push('/'));
      } else if (err) {
        console.error(err);
        // this.dispatch(routerRedux.push('/'));
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  };

  setSession(authResult) {
    this.expiresAt = JSON.stringify(authResult.expiresIn * 1000 + Date.now());

    this.scheduleRenewal();
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', this.expiresAt);

    this.getProfile((err, profile) => {
      if (!err) {
        const { sub, name, email } = profile;
        window.setFullstoryIdentity(sub, name, email);
        $crisp.push(['set', 'user:email', [email]]);
        $crisp.push(['set', 'user:nickname', [name]]);
        $crisp.push(['set', 'session:segments', [['recruiter']]]);
        localStorage.setItem('profile', JSON.stringify(profile));
      } else {
        return this.logout();
      }

      setAuthority('user');
      reloadAuthorized();
      if (window.location.pathname === '/user/callback') {
        const origin = localStorage.getItem('origin');
        localStorage.removeItem('origin');
        this.dispatch(routerRedux.push(origin || '/'));
      }
      return null;
    });
  }

  logout = () => {
    clearTimeout(this.tokenRenewalTimeout);

    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');

    this.userProfile = null;

    setAuthority('guest');
    reloadAuthorized();
    this.dispatch(routerRedux.push('/'));
  };

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
      }
    });
  }

  // ...

  scheduleRenewal() {
    const { expiresAt } = this;
    const timeout = expiresAt - Date.now();
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }
}
