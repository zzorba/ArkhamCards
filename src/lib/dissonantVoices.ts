import * as Keychain from 'react-native-keychain';
import { t } from 'ttag';

import { authorize, AppAuthConfig } from './OAuthWrapper';

// @ts-ignore
const config: AppAuthConfig = {
  issuer: 'https://north101.co.uk',
  clientId: 'arkhamcards',
  clientSecret: 'arkhamcards',
  redirectUrl: 'arkhamcards://dissonantvoices/redirect',
  additionalParameters: {
    type: 'app',
  },
  serviceConfiguration: {
    authorizationEndpoint: 'https://north101.co.uk/api/authorize?type=app',
    tokenEndpoint: 'https://north101.co.uk/api/token',
  },
  skipCodeExchange: true,
};

export async function saveAuthResponse(accessToken: string) {
  return Keychain.setInternetCredentials('dissonantvoices', 'dissonantvoices', accessToken);
}

export async function getAccessToken() {
  const creds = await Keychain.getInternetCredentials('dissonantvoices');
  if (creds) {
    return creds.password;
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

export function signInFlow(): Promise<SignInResult> {
  return authorizeDissonantVoices()
    .then(async({
      success,
      token,
      error,
    }) => {
      if (success && token) {
        await saveAuthResponse(token);
        return {
          success: true,
        };
      }
      return {
        success: false,
        error,
      };
    }, () => {
      return {
        success: false,
        error: '',
      };
    });
}

export async function signOutFlow() {
  Keychain.resetInternetCredentials('dissonantvoices');
}

interface DissonantVoicesAuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}
export async function authorizeDissonantVoices(): Promise<DissonantVoicesAuthResponse> {
  const { accessToken } = await authorize(config);
  const response = await fetch(`https://north101.co.uk/api/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: accessToken, type: 'app', client_id: 'arkhamcards' }),
  });
  if (response.status !== 200) {
    throw Error('Invalid token');
  }
  const { token, is_patron } = await response.json();
  if (!is_patron) {
    return {
      success: false,
      error: t`Sorry, you don't seem to be a Mythos Buster patron.\nIt can take up to 24hrs before Patreon updates your membership status. If you are still experiencing problems after 24hrs, please contact Mythos Busters via Patreon or on the Discord channel for help with this issue.`,
    };
  }
  return {
    success: true,
    token,
  };
}

export default {
  prefetch,
  signInFlow,
  signOutFlow,
  getAccessToken,
};
