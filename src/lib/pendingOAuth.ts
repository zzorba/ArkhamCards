import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persistence for an in-flight OAuth authorization so it can be completed even
 * if the OS kills the app while the external browser is in the foreground
 * (common on Android under memory pressure).
 *
 * Only the transient PKCE material is stored, and only until the redirect is
 * consumed. The record is single-use and TTL-bounded.
 */

export type OAuthProvider = 'arkhamdb' | 'dissonantVoices';

export interface PendingOAuth {
  provider: OAuthProvider;
  state: string;
  codeVerifier: string;
  redirectUri: string;
  /** ms since epoch, used to expire stale records. */
  createdAt: number;
}

const KEY_PREFIX = '@oauth_pending:';
const TTL_MS = 10 * 60 * 1000; // 10 minutes — an auth code is short-lived anyway.

function storageKey(provider: OAuthProvider): string {
  return `${KEY_PREFIX}${provider}`;
}

export async function savePendingOAuth(pending: PendingOAuth): Promise<void> {
  await AsyncStorage.setItem(storageKey(pending.provider), JSON.stringify(pending));
}

export async function clearPendingOAuth(provider: OAuthProvider): Promise<void> {
  await AsyncStorage.removeItem(storageKey(provider));
}

// Serializes claims so that, even if the warm path and the cold-start deep-link
// handler race within the same process, only the first caller receives the
// record — everyone after it reads empty storage and gets null.
let claimChain: Promise<unknown> = Promise.resolve();

/**
 * Atomically read-and-delete the pending record. Returns it to the first caller
 * only; subsequent callers (and stale/expired records) get null. This is what
 * makes the authorization code single-use across both completion paths.
 */
export function claimPendingOAuth(provider: OAuthProvider): Promise<PendingOAuth | null> {
  const result = claimChain.then(async(): Promise<PendingOAuth | null> => {
    const raw = await AsyncStorage.getItem(storageKey(provider));
    if (!raw) {
      return null;
    }
    await AsyncStorage.removeItem(storageKey(provider));
    try {
      const parsed = JSON.parse(raw) as PendingOAuth;
      if (Date.now() - parsed.createdAt > TTL_MS) {
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });
  // Keep the chain alive but never let a rejection wedge future claims.
  claimChain = result.catch(() => null);
  return result;
}
