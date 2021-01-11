import { forEach } from 'lodash';
import { parse } from 'query-string';
import { AppState, AppStateStatus, Linking, Platform } from 'react-native';
import { authorize as appAuthAuthorize, AuthConfiguration } from 'react-native-app-auth';


export type AppAuthConfig = AuthConfiguration;

export interface AuthorizeResponse {
  accessToken: string;
  accessTokenExpirationDate: number;
  refreshToken: string;
}

export async function authorize(config: AppAuthConfig): Promise<AuthorizeResponse> {
  try {
    const r = await appAuthAuthorize(config);
    return {
      accessToken: r.accessToken,
      accessTokenExpirationDate: Date.parse(r.accessTokenExpirationDate),
      refreshToken: r.refreshToken,
    };
  } catch (e) {
    if (Platform.OS !== 'android' || e.code !== 'browser_not_found') {
      return Promise.reject(e.message);
    }
  }
  const serviceConfiguration = config.serviceConfiguration;
  // Fallback for android;
  if (!serviceConfiguration) {
    return Promise.reject();
  }
  const originalState: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return new Promise<AuthorizeResponse>((resolve, reject) => {
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

    const handleUrl = (event: { url: string }) => {
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
        const tokenRequest = {
          code: `${code}`,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUrl,
          grant_type: 'authorization_code',
        };
        const s: string[] = [];
        forEach(tokenRequest, (value, key) => {
          if (value !== undefined) {
            s.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
          }
        });
        fetch(serviceConfiguration.tokenEndpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: s.join('&'),
        }).then(response => response.json().then(jsonResponse => {
          const accessTokenExpirationDate = new Date().getTime() + jsonResponse.expires_in * 1000;
          resolve({
            accessToken: jsonResponse.access_token,
            accessTokenExpirationDate,
            refreshToken: jsonResponse.refresh_token,
          });
          cleanup();
        })).catch(() => {
          reject();
          cleanup();
        });
      }
    };
    Linking.addEventListener('url', handleUrl);

    cleanup = () => {
      Linking.removeEventListener('url', handleUrl);
      AppState.removeEventListener('change', handleAppStateChange);
    };

    const authUrl = `${serviceConfiguration.authorizationEndpoint}?redirect_uri=${encodeURIComponent(config.redirectUrl)}&client_id=${encodeURIComponent(config.clientId)}&response_type=code&state=${encodeURIComponent(originalState)}`;
    Linking.openURL(authUrl);
  });
}

export function refresh(
  config: AppAuthConfig,
  refreshToken: string
): Promise<AuthorizeResponse> {
  if (Platform.OS === 'ios') {
    const { refresh } = require('react-native-app-auth');
    return refresh(config, { refreshToken });
  }

  return new Promise<AuthorizeResponse>((resolve, reject) => {
    const tokenRequest = {
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token',
    };
    const s: string[] = [];
    forEach(tokenRequest, (value, key) => {
      if (value !== undefined) {
        s.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    });
    if (!config.serviceConfiguration) {
      reject();
    } else {
      fetch(config.serviceConfiguration.tokenEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: s.join('&'),
      }).then(response => response.json().then(jsonResponse => {
        resolve({
          accessToken: jsonResponse.access_token,
          accessTokenExpirationDate: new Date().getTime() + jsonResponse.expires_in * 1000,
          refreshToken: jsonResponse.refresh_token,
        });
      })).catch(reject);
    }
  });
}


export function revoke(
  config: AppAuthConfig,
  tokenToRevoke: string
): Promise<void> {
  if (Platform.OS === 'ios') {
    const { revoke } = require('react-native-app-auth');
    return revoke(config, { tokenToRevoke });
  }
  return new Promise<void>((resolve, reject) => {
    const tokenRequest = {
      token: tokenToRevoke,
      client_id: config.clientId,
    };
    const s: string[] = [];
    forEach(tokenRequest, (value, key) => {
      s.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    if (config.serviceConfiguration?.revocationEndpoint) {
      fetch(config.serviceConfiguration.revocationEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: s.join('&'),
      }).then(() => resolve()).catch(reject);
    } else {
      reject();
    }
  });
}
