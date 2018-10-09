import auth0 from 'auth0-js';
import { routerRedux } from 'dva/router';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

import { AUTH_CONFIG } from './auth0-variables';

// import history from '../history';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: "login.deephire.io",
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid profile email',
  });


   auth0Social = new auth0.WebAuth({
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
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login(username, password) {
    this.auth0.login(
      { realm: AUTH_CONFIG.dbConnectionName, username, password },
      (err, authResult) => {
        if (err) {
          console.log(err);
          // alert(`Error: ${err.description}. Check the c÷nsole for further details.`);
        }
      }
    );

    // this.auth0.
  }

  renewToken() {
    webAuth.checkSession({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        setSession(result);
      }
    });
  }

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

  signup(email, password) {
    this.auth0.signup({ connection: AUTH_CONFIG.dbConnectionName, email, password }, err => {
      if (err) {
        console.log(err);
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
            console.log(err);
            alert(`Error: ${err.description}. Check the console for further details.`);
          }
        }
      );
    });
  }

  loginWithGoogle() {
    this.auth0Social.authorize({ connection: 'google-oauth2' });
  }

  loginWithLinkedin() {
    this.auth0Social.authorize({ connection: 'linkedin' });
  }

  loginWithFacebook() {
    this.auth0Social.authorize({ connection: 'facebook' });
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.dispatch(routerRedux.push('/'));

        // history.replace('/home');
      } else if (err) {
        this.dispatch(routerRedux.push('/'));

        // history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    // navigate to the home route
    // history.replace('/home');
    this.getProfile((err, profile) => {
      if (!err) {
        localStorage.setItem('profile', JSON.stringify(profile));
      } else {
        return this.logout();
      }

      setAuthority('user');
      reloadAuthorized();
      // navigate to the home route
      this.dispatch(routerRedux.push('/'));
      // navigate to the home route
    });
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');

    this.userProfile = null;
    // might not need this

    setAuthority('guest');
    reloadAuthorized();
    // might not need this
    this.dispatch(routerRedux.push('/'));
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
