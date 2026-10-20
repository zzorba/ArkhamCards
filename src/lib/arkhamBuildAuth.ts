import * as Keychain from 'react-native-keychain';

import { authorize, completeAuthorization, refresh, revoke, AppAuthConfig, AUTH_ALREADY_COMPLETED } from './OAuthWrapper';
import { getEnvVar } from './env';

const PROVIDER = 'arkhamBuild';
const KEYCHAIN_SERVICE = 'arkham-build';

const VERBOSE = __DEV__;

const ARKHAM_BUILD_CLIENT_ID = getEnvVar('ARKHAM_BUILD_CLIENT_ID');
const ARKHAM_BUILD_CLIENT_SECRET = getEnvVar('ARKHAM_BUILD_CLIENT_SECRET');

const API_BASE = 'https://api.arkham.build';

const config: AppAuthConfig = {
  clientId: ARKHAM_BUILD_CLIENT_ID,
  clientSecret: ARKHAM_BUILD_CLIENT_SECRET,
  redirectUrl: 'arkhamcards://arkhambuild',
  scopes: ['profile:read', 'decks:read'],
  serviceConfiguration: {
    authorizationEndpoint: `${API_BASE}/v2/oauth/authorize`,
    tokenEndpoint: `${API_BASE}/v2/oauth/token`,
    revocationEndpoint: `${API_BASE}/v2/oauth/revoke`,
  },
};

async function saveAuthResponse(
  response: any
): Promise<string | null> {
  const serialized = JSON.stringify(response);
  await Keychain.setGenericPassword('arkham-build', serialized, { service: KEYCHAIN_SERVICE });
  return response.accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
  if (creds) {
    const data = JSON.parse(creds.password);
    return data.refreshToken;
  }
  return null;
}

let _refreshPromise: Promise<string | null> | null = null;
async function doRefreshToken(refreshToken: string): Promise<string | null> {
  if (_refreshPromise) {
    VERBOSE && console.log('[arkham.build] collapsed multiple requests to update the refresh token');
    return _refreshPromise;
  }
  try {
    _refreshPromise = refresh(config, refreshToken).then((response) => {
      VERBOSE && console.log('[arkham.build] Successfully refreshed the token');
      return saveAuthResponse(response);
    }, (e) => {
      VERBOSE && console.log(`[arkham.build] Error while refreshing: ${e.message || e}`);
      return null;
    });
    return await _refreshPromise;
  } finally {
    _refreshPromise = null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
  if (creds) {
    const data = JSON.parse(creds.password);
    const nowSeconds = new Date().getTime() / 1000;
    const expiration = new Date(
      data.accessTokenExpirationDate
    ).getTime() / 1000;
    if (expiration < nowSeconds) {
      if (data.refreshToken) {
        VERBOSE && console.log('[arkham.build] Token has expired, trying to refresh');
        return await doRefreshToken(data.refreshToken);
      }
      VERBOSE && console.log('[arkham.build] Token has expired but we have no refresh token.');
    }
    return data.accessToken;
  }
  return null;
}

interface SignInResult {
  success: boolean;
  error?: string | Error;
}

export async function signInFlow(): Promise<SignInResult> {
  try {
    const response = await authorize(config, PROVIDER);
    await saveAuthResponse(response);
    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || err,
    };
  }
}

export const REDIRECT_URL_PREFIX = 'arkhamcards://arkhambuild';

export async function completeSignInFromRedirect(url: string): Promise<SignInResult> {
  try {
    const params: Record<string, string> = {};
    new URL(url).searchParams.forEach((value, key) => {
      params[key] = value;
    });
    const response = await completeAuthorization(config, PROVIDER, params);
    await saveAuthResponse(response);
    return { success: true };
  } catch (err) {
    if ((err?.message || err) === AUTH_ALREADY_COMPLETED) {
      const accessToken = await getAccessToken();
      return accessToken
        ? { success: true }
        : { success: false, error: 'Login could not be completed' };
    }
    return {
      success: false,
      error: err.message || err,
    };
  }
}

export async function signOutFlow(): Promise<void> {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      await revoke(config, accessToken);
    }
  } catch (e) {
    // Ignore
  }
  try {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      await revoke(config, refreshToken);
    }
  } catch (e) {
    // Ignore
  }
  await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
}

export default {
  signInFlow,
  signOutFlow,
  getAccessToken,
};
