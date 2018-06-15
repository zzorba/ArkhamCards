import Config from 'react-native-config';
import * as Keychain from 'react-native-keychain';
import { authorize, refresh } from 'react-native-app-auth';

const config = {
  clientId: Config.OAUTH_CLIENT_ID,
  clientSecret: Config.OAUTH_CLIENT_SECRET,
  redirectUrl: 'arkhamcards://auth/redirect',
  scopes: [''],
  serviceConfiguration: {
    authorizationEndpoint: 'https://arkhamdb.com/oauth/v2/auth',
    tokenEndpoint: 'https://arkhamdb.com/oauth/v2/token',
    revocationEndpoint: 'https://arkhamdb.com/oauth/v2/revoke',
  },
};

function saveAuthResponse(response) {
  const serialized = JSON.stringify(response);
  console.log(serialized);
  return Keychain.setGenericPassword('arkhamdb', serialized).then(() => {
    return response.accessToken;
  });
}

export function getOAuthToken() {
  return Keychain.getGenericPassword()
    .then(creds => {
      if (creds) {
        const nowSeconds = (new Date()).getTime() / 1000;
        const expiration = new Date(data.accessTokenExpirationDate).getTime() / 1000;
        const data = JSON.parse(creds.password);
        if (data.refreshToken && expiration < nowSeconds) {
          return refresh(config, { refreshToken: data.refreshToken })
            .then(saveAuthResponse);
        } else {
          return data.accessToken;
        }
      }
      return null;
    });
}

export function signIn() {
  return authorize(config).then(saveAuthResponse);
}

export default {
  signIn,
  getOAuthToken,
};
