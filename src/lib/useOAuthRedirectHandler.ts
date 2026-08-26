import { useEffect, useRef } from 'react';
import { Linking } from 'react-native';

import { useAppDispatch } from '@app/store';
import { completeArkhamDbLoginFromRedirect, completePatreonLoginFromRedirect } from '@actions';
import { REDIRECT_URL_PREFIX as ARKHAMDB_REDIRECT } from '@lib/auth';
import { REDIRECT_URL_PREFIX as PATREON_REDIRECT } from '@lib/patreon';

/**
 * Completes OAuth logins that were interrupted by the OS killing the app while
 * the external browser was foregrounded (common on Android under memory
 * pressure). On a normal ("warm") login the browser session resolves the flow
 * in-process and these redirects never reach `Linking`; this handler only fires
 * when the app cold-starts from the redirect launch intent.
 *
 * Mount once, inside the Redux provider.
 */
export default function useOAuthRedirectHandler(): void {
  const dispatch = useAppDispatch();
  // Guards against handling the same redirect twice within a session (e.g. if a
  // warm `url` event and getInitialURL both surface it).
  const handledUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleUrl = (url: string | null): void => {
      if (!url || handledUrls.current.has(url)) {
        return;
      }
      if (url.startsWith(ARKHAMDB_REDIRECT)) {
        handledUrls.current.add(url);
        dispatch(completeArkhamDbLoginFromRedirect(url));
      } else if (url.startsWith(PATREON_REDIRECT)) {
        handledUrls.current.add(url);
        dispatch(completePatreonLoginFromRedirect(url));
      }
    };

    // Cold start: the app was launched (or relaunched after being killed) by the
    // redirect intent.
    Linking.getInitialURL().then(handleUrl);

    // Foreground/backgrounded-but-alive: harmless belt-and-suspenders.
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => subscription.remove();
  }, [dispatch]);
}
