import { parse } from 'query-string';
import { AppState, AppStateStatus, Linking } from 'react-native';
import * as Keychain from 'react-native-keychain';

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
  return authorize()
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

export async function authorize(): Promise<string> {
  const originalState: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  return new Promise((resolve, reject) => {
    /* eslint-disable @typescript-eslint/no-empty-function */
    let cleanup: () => void = () => {};
    let abandoned = true;
    let currentAppState: AppStateStatus = AppState.currentState;
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        (currentAppState === 'inactive' || currentAppState === 'background') &&
        nextAppState === 'active'
      ) {
        if (abandoned) {
          abandoned = true;
          reject(new Error('Abandoned by user'));
          cleanup();
        }
      }
      currentAppState = nextAppState;
    };
    AppState.addEventListener('change', handleAppStateChange);

    const handleUrl = async(event: { url: string; }) => {
      abandoned = false;
      const {
        state,
        code,
        error,
      } = parse(event.url.substring(event.url.indexOf('?') + 1));
      if (error === 'access_denied') {
        reject(new Error('Access was denied by user.'));
        cleanup();
      } else if (state !== originalState) {
        reject(new Error('Stale state detected.'));
        cleanup();
      } else {
        try {
          const response = await fetch(`https://north101.co.uk/token`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code }),
          });
          console.log(response);
          if (response.status !== 200) {
            throw Error('Invalid token');
          }
          const text = await response.text();
          resolve(text);
          cleanup();
        } catch(error) {
          reject(error);
          cleanup();
        }
      }
    };
    Linking.addEventListener('url', handleUrl);

    cleanup = () => {
      Linking.removeEventListener('url', handleUrl);
      AppState.removeEventListener('change', handleAppStateChange);
    };

    Linking.openURL(`https://north101.co.uk/authorize?state=${originalState}`);
  });
}

export default {
  prefetch,
  signInFlow,
  signOutFlow,
  getAccessToken,
};
