import Config from 'react-native-config';
import * as Keychain from 'react-native-keychain';

import { authorize, refresh, revoke, AppAuthConfig } from './OAuthWrapper';

const VERBOSE = false;
// @ts-ignore
const config: AppAuthConfig = {
  issuer: Config.OAUTH_SITE,
  clientId: Config.OAUTH_CLIENT_ID,
  clientSecret: Config.OAUTH_CLIENT_SECRET,
  redirectUrl: 'arkhamcards://auth/redirect',
  serviceConfiguration: {
    authorizationEndpoint: `${Config.OAUTH_SITE}oauth/v2/auth`,
    tokenEndpoint: `${Config.OAUTH_SITE}oauth/v2/token`,
    revocationEndpoint: `${Config.OAUTH_SITE}oauth/v2/revoke`,
  },
};

async function saveAuthResponse(
  response: any
): Promise<string | null> {
  const serialized = JSON.stringify(response);
  await Keychain.setGenericPassword('arkhamdb', serialized);
  return response.accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword();
  if (creds) {
    const data = JSON.parse(creds.password);
    return data.refreshToken;
  }
  return null;
}

// Use a singleton pattern to make sure two people don't request
// a new refresh token at the same time, which will cause a race condition and be very bad.
let _refreshPromise: Promise<string | null> | null = null;
async function doRefreshToken(refreshToken: string): Promise<string | null> {
  if (_refreshPromise) {
    VERBOSE && console.log('collapsed multiple requests to update the refresh token');
    return _refreshPromise;
  }
  try {
    _refreshPromise = refresh(config, refreshToken).then((response) => {
      VERBOSE && console.log('Successfully refreshed the token');
      return saveAuthResponse(response);
    }, (e) => {
      VERBOSE && console.log('Error while refreshing: ' + (e.message || e));
      return null;
    });
    return await _refreshPromise;
  } finally {
    _refreshPromise = null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword();
  if (creds) {
    const data = JSON.parse(creds.password);
    const nowSeconds = new Date().getTime() / 1000;
    const expiration = new Date(
      data.accessTokenExpirationDate
    ).getTime() / 1000;
    if (expiration < nowSeconds) {
      if (data.refreshToken) {
        VERBOSE && console.log(`Token has expired, trying to refresh the arkhamdb token with: ${data.refreshToken}`);
        return await doRefreshToken(data.refreshToken);
      } else {
        VERBOSE && console.log('Our token has expired but we have no refresh token.');
      }
    }
    return data.accessToken;
  }
  return null;
}

interface SignInResult {
  success: boolean;
  error?: string | Error;
}

export function prefetch(): Promise<void> {
  return Promise.resolve();
}

export async function signInFlow(): Promise<SignInResult> {
  try {
    const response = await authorize(config);
    await saveAuthResponse(response);
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || err,
    };
  };
}

export async function signOutFlow(): Promise<void> {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      await revoke(config, accessToken);
    }
  } catch (e) {
    // Ignore the error, if any
  }
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await revoke(config, refreshToken);
    }
  } catch (e) {
    //Ignore the error, if any
  }
  await Keychain.resetGenericPassword();
}

export default {
  prefetch,
  signInFlow,
  signOutFlow,
  getAccessToken,
};
