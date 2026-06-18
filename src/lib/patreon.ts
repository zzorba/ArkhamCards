import * as Keychain from 'react-native-keychain';
import * as WebBrowser from 'expo-web-browser';

const WORKERS_BASE = 'https://workers.arkhamcards.com/arkham-cards/v1';

// Patreon campaign IDs — any active paid membership in these grants audio access.
const ALLOWED_CAMPAIGN_IDS = new Set([
  '1920024', // MythosBusters
  '5856505', // ArkhamCards
]);

const PATREON_IDENTITY_URL =
  'https://www.patreon.com/api/oauth2/v2/identity' +
  '?include=memberships.campaign' +
  '&fields%5Bmember%5D=patron_status,currently_entitled_amount_cents' +
  '&fields%5Bcampaign%5D=vanity';

const KEYCHAIN_SERVICE = 'patreon';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

async function saveTokens(tokens: StoredTokens): Promise<void> {
  await Keychain.setInternetCredentials(
    KEYCHAIN_SERVICE,
    'patreon',
    JSON.stringify(tokens)
  );
}

async function loadTokens(): Promise<StoredTokens | null> {
  const creds = await Keychain.getInternetCredentials(KEYCHAIN_SERVICE);
  if (!creds) {
    return null;
  }
  try {
    return JSON.parse(creds.password) as StoredTokens;
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const tokens = await loadTokens();
  return tokens?.accessToken ?? null;
}

export async function refreshTokens(): Promise<string | null> {
  const tokens = await loadTokens();
  if (!tokens?.refreshToken) {
    return null;
  }

  const res = await fetch(`${WORKERS_BASE}/patreon/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: tokens.refreshToken }),
  });

  if (!res.ok) {
    return null;
  }

  const { access_token, refresh_token } =
    await res.json() as { access_token: string; refresh_token: string };

  await saveTokens({ accessToken: access_token, refreshToken: refresh_token });
  return access_token;
}

export async function checkIsPatron(accessToken: string): Promise<boolean> {
  const res = await fetch(PATREON_IDENTITY_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json() as {
    included?: Array<{
      type: string;
      attributes: {
        patron_status: string | null;
        currently_entitled_amount_cents: number;
      };
      relationships?: {
        campaign?: { data: { id: string } | null };
      };
    }>;
  };

  return (data.included ?? []).some(
    item =>
      item.type === 'member' &&
      item.attributes.patron_status === 'active_patron' &&
      item.attributes.currently_entitled_amount_cents > 0 &&
      item.relationships?.campaign?.data?.id !== undefined &&
      ALLOWED_CAMPAIGN_IDS.has(item.relationships.campaign.data.id)
  );
}

export interface SignInResult {
  success: boolean;
  error?: string;
}

export async function signInFlow(): Promise<SignInResult> {
  const result = await WebBrowser.openAuthSessionAsync(
    `${WORKERS_BASE}/patreon/connect`,
    'arkhamcards://patreon/result'
  );

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return { success: false, error: 'Cancelled' };
  }
  if (result.type !== 'success') {
    return { success: false, error: 'Authorization failed' };
  }

  const url = new URL(result.url);
  const access_token = url.searchParams.get('access_token');
  const refresh_token = url.searchParams.get('refresh_token');
  const error = url.searchParams.get('error');

  if (error) {
    return { success: false, error };
  }
  if (!access_token || !refresh_token) {
    return { success: false, error: 'Missing tokens in response' };
  }

  await saveTokens({ accessToken: access_token, refreshToken: refresh_token });

  const isPatron = await checkIsPatron(access_token);
  if (!isPatron) {
    await Keychain.resetInternetCredentials({ server: KEYCHAIN_SERVICE });
    return {
      success: false,
      error: 'No active paid membership found for Mythos Busters on Patreon.',
    };
  }

  return { success: true };
}

export async function signOutFlow(): Promise<void> {
  await Keychain.resetInternetCredentials({ server: KEYCHAIN_SERVICE });
}

export async function verifyLogin(): Promise<boolean> {
  let accessToken = await getAccessToken();
  if (!accessToken) {
    return false;
  }

  const isPatron = await checkIsPatron(accessToken);
  if (isPatron) {
    return true;
  }

  // Token might be expired — try refreshing
  accessToken = await refreshTokens();
  if (!accessToken) {
    return false;
  }

  return checkIsPatron(accessToken);
}

export default {
  signInFlow,
  signOutFlow,
  getAccessToken,
  verifyLogin,
};
