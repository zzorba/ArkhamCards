import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

export interface ServiceConfiguration {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  revocationEndpoint?: string;
}

export interface AppAuthConfig {
  issuer?: string;
  clientId: string;
  clientSecret?: string;
  redirectUrl: string;
  serviceConfiguration?: ServiceConfiguration;
  scopes?: string[];
  additionalParameters?: Record<string, string>;
}

export interface AuthorizeResponse {
  accessToken: string;
  accessTokenExpirationDate?: number;
  refreshToken?: string;
}

function calculateExpirationDate(expiresIn?: number, issuedAt?: number): number | undefined {
  if (!expiresIn) {
    return undefined;
  }
  const baseTime = issuedAt !== undefined ? issuedAt : Date.now() / 1000;
  return (baseTime + expiresIn) * 1000;
}

export async function authorize(config: AppAuthConfig): Promise<AuthorizeResponse> {
  const serviceConfiguration = config.serviceConfiguration;
  if (!serviceConfiguration) {
    return Promise.reject(new Error('Service configuration is required'));
  }

  console.log('[OAuth] Starting authorization flow', { platform: Platform.OS, redirectUri: config.redirectUrl });

  const discovery = {
    authorizationEndpoint: serviceConfiguration.authorizationEndpoint,
    tokenEndpoint: serviceConfiguration.tokenEndpoint,
    revocationEndpoint: serviceConfiguration.revocationEndpoint,
  };

  const authRequest = new AuthSession.AuthRequest({
    clientId: config.clientId,
    redirectUri: config.redirectUrl,
    scopes: config.scopes,
    extraParams: config.additionalParameters,
  });

  const promptOptions = Platform.OS === 'android'
    ? { useProxy: false, preferEphemeralSession: false }
    : { useProxy: false };

  console.log('[OAuth] Calling promptAsync', { discovery, promptOptions });
  const result = await authRequest.promptAsync(discovery, promptOptions);
  console.log('[OAuth] promptAsync result', { type: result.type });

  if (result.type === 'success') {
    const tokenResult = await AuthSession.exchangeCodeAsync(
      {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        code: result.params.code,
        redirectUri: config.redirectUrl,
        extraParams: {},
      },
      discovery
    );

    return {
      accessToken: tokenResult.accessToken,
      accessTokenExpirationDate: calculateExpirationDate(tokenResult.expiresIn, tokenResult.issuedAt),
      refreshToken: tokenResult.refreshToken,
    };
  }

  if (result.type === 'error') {
    return Promise.reject(new Error(result.error?.description || 'Authentication failed'));
  }

  return Promise.reject(new Error('Authentication was cancelled'));
}

export async function refresh(
  config: AppAuthConfig,
  refreshToken: string
): Promise<AuthorizeResponse> {
  const serviceConfiguration = config.serviceConfiguration;
  if (!serviceConfiguration) {
    return Promise.reject(new Error('Service configuration is required'));
  }

  const discovery = {
    authorizationEndpoint: serviceConfiguration.authorizationEndpoint,
    tokenEndpoint: serviceConfiguration.tokenEndpoint,
    revocationEndpoint: serviceConfiguration.revocationEndpoint,
  };

  const tokenResult = await AuthSession.refreshAsync(
    {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      refreshToken,
      extraParams: {},
    },
    discovery
  );

  return {
    accessToken: tokenResult.accessToken,
    accessTokenExpirationDate: calculateExpirationDate(tokenResult.expiresIn, tokenResult.issuedAt),
    refreshToken: tokenResult.refreshToken,
  };
}


export async function revoke(
  config: AppAuthConfig,
  tokenToRevoke: string
): Promise<void> {
  const serviceConfiguration = config.serviceConfiguration;
  if (!serviceConfiguration?.revocationEndpoint) {
    return Promise.reject(new Error('Revocation endpoint is required'));
  }

  const discovery = {
    authorizationEndpoint: serviceConfiguration.authorizationEndpoint,
    tokenEndpoint: serviceConfiguration.tokenEndpoint,
    revocationEndpoint: serviceConfiguration.revocationEndpoint,
  };

  await AuthSession.revokeAsync(
    {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      token: tokenToRevoke,
    },
    discovery
  );
}
