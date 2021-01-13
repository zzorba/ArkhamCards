import * as Keychain from 'react-native-keychain';

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
    .then(saveAuthResponse)
    .then(() => {
      return {
        success: true,
      };
    }, (error: Error) => {
      return {
        success: false,
        error: error.message || error,
      };
    });
}

export async function signOutFlow() {
  Keychain.resetInternetCredentials('dissonantvoices');
}

export async function authorizeDissonantVoices(): Promise<string> {
  const { accessToken } = await authorize(config);
  const response = await fetch(`https://north101.co.uk/api/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: accessToken, client_id: 'arkhamcards' }),
  });
  console.log(response);
  if (response.status !== 200) {
    throw Error('Invalid token');
  }
  const text = await response.text();
  return text;
}

export default {
  prefetch,
  signInFlow,
  signOutFlow,
  getAccessToken,
};
