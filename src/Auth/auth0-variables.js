const currentUrl = `${window.location.origin}/user/callback`;

const AUTH_CONFIG = {
  domain: 'login.deephire.com',
  clientId: 'jhzGFZHTv8ehpGskVKxZr_jXOAvKg7DU',
  callbackUrl: currentUrl,
  // callbackUrl: 'http://localhost:8000/user/callback',
  // callbackUrl: 'https://recruiter.deephire.com/user/callback',
  dbConnectionName: 'EmailDB',
};

export default AUTH_CONFIG;
