import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';

import {
  OAuthProvider,
  savePendingOAuth,
  claimPendingOAuth,
  clearPendingOAuth,
} from './pendingOAuth';

/** Thrown when the authorization code was already exchanged by the other completion path. */
export const AUTH_ALREADY_COMPLETED = 'AUTH_ALREADY_COMPLETED';

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

function buildDiscovery(serviceConfiguration: ServiceConfiguration) {
  return {
    authorizationEndpoint: serviceConfiguration.authorizationEndpoint,
    tokenEndpoint: serviceConfiguration.tokenEndpoint,
    revocationEndpoint: serviceConfiguration.revocationEndpoint,
  };
}

/**
 * Begin an authorization flow. Before opening the browser we persist the PKCE
 * verifier + state so the flow can be completed later even if the OS kills the
 * app while the browser is foregrounded. If the process survives, this resolves
 * with tokens directly (the "warm" path). If it is killed, the promise is lost
 * and completion happens instead via `completeAuthorization` from the cold-start
 * deep-link handler.
 */
export async function authorize(config: AppAuthConfig, provider: OAuthProvider): Promise<AuthorizeResponse> {
  const serviceConfiguration = config.serviceConfiguration;
  if (!serviceConfiguration) {
    return Promise.reject(new Error('Service configuration is required'));
  }

  console.log('[OAuth] Starting authorization flow', { platform: Platform.OS, redirectUri: config.redirectUrl });

  const discovery = buildDiscovery(serviceConfiguration);

  const authRequest = new AuthSession.AuthRequest({
    clientId: config.clientId,
    redirectUri: config.redirectUrl,
    scopes: config.scopes,
    extraParams: config.additionalParameters,
  });

  // Populate codeVerifier + state before handing control to the browser so we
  // can persist them for the cold-start recovery path.
  await authRequest.makeAuthUrlAsync(discovery);
  await savePendingOAuth({
    provider,
    state: authRequest.state,
    codeVerifier: authRequest.codeVerifier ?? '',
    redirectUri: config.redirectUrl,
    createdAt: Date.now(),
  });

  const promptOptions = Platform.OS === 'android'
    ? { useProxy: false, preferEphemeralSession: false }
    : { useProxy: false };

  console.log('[OAuth] Calling promptAsync', { discovery, promptOptions });
  const result = await authRequest.promptAsync(discovery, promptOptions);
  console.log('[OAuth] promptAsync result', { type: result.type });

  if (result.type === 'success') {
    return completeAuthorization(config, provider, result.params);
  }

  if (result.type === 'error') {
    await clearPendingOAuth(provider);
    return Promise.reject(new Error(result.error?.description || 'Authentication failed'));
  }

  await clearPendingOAuth(provider);
  return Promise.reject(new Error('Authentication was cancelled'));
}

/**
 * Complete an authorization from a redirect. Callable from either completion
 * path with the redirect's query params. Claims the single-use pending record
 * (which also validates CSRF state) and exchanges the code for tokens.
 *
 * Rejects with `AUTH_ALREADY_COMPLETED` if the record was already consumed by
 * the other path — callers should treat that as benign.
 */
export async function completeAuthorization(
  config: AppAuthConfig,
  provider: OAuthProvider,
  params: Record<string, string>
): Promise<AuthorizeResponse> {
  const serviceConfiguration = config.serviceConfiguration;
  if (!serviceConfiguration) {
    return Promise.reject(new Error('Service configuration is required'));
  }
  const discovery = buildDiscovery(serviceConfiguration);

  if (params.error) {
    await clearPendingOAuth(provider);
    return Promise.reject(new Error(params.error_description || params.error));
  }
  const code = params.code;
  if (!code) {
    return Promise.reject(new Error('No authorization code in redirect'));
  }

  const pending = await claimPendingOAuth(provider);
  if (!pending) {
    // Already consumed by the other completion path (or expired/stale).
    return Promise.reject(new Error(AUTH_ALREADY_COMPLETED));
  }
  if (params.state && pending.state && params.state !== pending.state) {
    return Promise.reject(new Error('State mismatch — possible CSRF, aborting.'));
  }

  const tokenResult = await AuthSession.exchangeCodeAsync(
    {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      code,
      redirectUri: pending.redirectUri || config.redirectUrl,
      extraParams: pending.codeVerifier ? { code_verifier: pending.codeVerifier } : {},
    },
    discovery
  );

  return {
    accessToken: tokenResult.accessToken,
    accessTokenExpirationDate: calculateExpirationDate(tokenResult.expiresIn, tokenResult.issuedAt),
    refreshToken: tokenResult.refreshToken,
  };
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
