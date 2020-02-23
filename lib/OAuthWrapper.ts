import { forEach, keys } from 'lodash';
import SafariWebAuth from 'react-native-safari-web-auth';
import { parse } from 'query-string';
import { Linking, Platform } from 'react-native';

export interface AppAuthConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  serviceConfiguration: {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    revocationEndpoint: string;
  };
}

export interface AuthorizeResponse {
  accessToken: string;
  accessTokenExpirationDate: number;
  refreshToken: string;
}

export function authorize(config: AppAuthConfig): Promise<AuthorizeResponse> {
  if (!config.serviceConfiguration) {
    return Promise.reject();
  }
  const originalState: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return new Promise<AuthorizeResponse>((resolve, reject) => {
    const handleUrl = (event: { url: string }) => {
      const {
        state,
        code,
        error,
      } = parse(event.url.substring(event.url.indexOf('?') + 1));
      if (error === 'access_denied') {
        reject(new Error('Access was denied by user.'));
      } else if (state !== originalState) {
        reject(new Error('Stale state detected.'));
      } else {
        const tokenRequest = {
          code: `${code}`,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUrl,
          grant_type: 'authorization_code'
        };
        const s: string[] = [];
        forEach(tokenRequest, (value, key) => {
          if (tokenRequest.hasOwnProperty(key)) {
            s.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
        });
        fetch(config.serviceConfiguration.tokenEndpoint, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: s.join('&')
        }).then(response => response.json().then(jsonResponse => {
          const accessTokenExpirationDate = new Date().getTime() + jsonResponse.expires_in * 1000;
          resolve({
            accessToken: jsonResponse.access_token,
            accessTokenExpirationDate,
            refreshToken: jsonResponse.refresh_token,
          });
        }))
        .catch(error => reject(error));
      }
      Linking.removeEventListener('url', handleUrl)
    };
    Linking.addEventListener('url', handleUrl)
    const authUrl = `${config.serviceConfiguration.authorizationEndpoint}?redirect_uri=${encodeURIComponent(config.redirectUrl)}&client_id=${encodeURIComponent(config.clientId)}&response_type=code&state=${encodeURIComponent(originalState)}`;
    if (Platform.OS === 'ios') {
      SafariWebAuth.requestAuth(authUrl);
    } else {
      Linking.openURL(authUrl);
    }
  });
}

export function refresh(
  config: AppAuthConfig,
  refreshToken: string
): Promise<AuthorizeResponse> {
  return new Promise<AuthorizeResponse>((resolve, reject) => {
    const tokenRequest = {
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'refresh_token'
    };
    const s: string[] = [];
    forEach(tokenRequest, (value, key) => {
      if (tokenRequest.hasOwnProperty(key)) {
        s.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    });

    fetch(config.serviceConfiguration.tokenEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: s.join('&')
    }).then(response => response.json().then(jsonResponse => {
      resolve({
        accessToken: jsonResponse.access_token,
        accessTokenExpirationDate: new Date().getTime() + jsonResponse.expires_in * 1000,
        refreshToken: jsonResponse.refresh_token,
      });
    }))
    .catch(error => reject(error));
  });
}


export function revoke(
  config: AppAuthConfig,
  tokenToRevoke: string
): Promise<{}> {
  return new Promise<AuthorizeResponse>((resolve, reject) => {
    const tokenRequest = {
      token: tokenToRevoke,
      client_id: config.clientId,
    };
    const s: string[] = [];
    forEach(tokenRequest, (value, key) => {
      if (tokenRequest.hasOwnProperty(key)) {
        s.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    });

    fetch(config.serviceConfiguration.revocationEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: s.join('&')
    }).then(() => resolve())
    .catch(error => reject(error));
  });
}
